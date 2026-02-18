import { useState, useCallback } from 'react';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TransactionOptions } from '@provablehq/aleo-types';
import { PROGRAM_ID } from '../utils/constants';
import { getSplitStatus, getSplitIdFromMapping, pollTransaction } from '../utils/aleo-utils';
import { useUIStore } from '../store/splitStore';
import { api } from '../services/api';
import type { PaymentStep } from '../types/split';

interface PayParams {
  creator: string;
  amount: string;
  salt: string;
  splitId?: string;
}

/** Extract microcredits from a wallet record */
function getMicrocredits(record: any): number {
  try {
    if (record.data?.microcredits) {
      return parseInt(String(record.data.microcredits).replace('u64', '').replace(/_/g, ''));
    }
    if (record.plaintext) {
      const match = record.plaintext.match(/microcredits:\s*([\d_]+)u64/);
      if (match?.[1]) return parseInt(match[1].replace(/_/g, ''));
    }
    return 0;
  } catch {
    return 0;
  }
}

/** Get the plaintext string for a record to pass as transaction input */
function getRecordPlaintext(record: any): string | null {
  if (record.plaintext) return record.plaintext;

  // Reconstruct from parts for credits records
  const nonce = record.nonce || record._nonce || record.data?._nonce;
  if (nonce && record.owner) {
    const microcredits = getMicrocredits(record);
    return `{ owner: ${record.owner}.private, microcredits: ${microcredits}u64.private, _nonce: ${nonce}.public }`;
  }

  if (record.ciphertext) return record.ciphertext;
  return null;
}

export function usePaySplit() {
  const { address, executeTransaction, requestRecords, decrypt, wallet } = useWallet();
  const addLog = useUIStore((s) => s.addLog);
  const [step, setStep] = useState<PaymentStep>('connect');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const pay = useCallback(async (params: PayParams) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Connect check
      setStep('connect');
      if (!address || !executeTransaction || !requestRecords) {
        setError('Wallet not connected');
        setStep('error');
        return false;
      }
      addLog(`Wallet connected: ${address.slice(0, 12)}...`, 'success');

      // Step 2: Verify split on-chain
      setStep('verify');
      addLog('Verifying split on-chain...', 'system');

      let splitId = params.splitId;
      if (!splitId || splitId === 'null') {
        splitId = await getSplitIdFromMapping(params.salt) || undefined;
      }

      if (splitId) {
        const status = await getSplitStatus(splitId);
        if (status && status.status === 1) {
          setError('This split is already settled');
          addLog('Split is already settled', 'error');
          setStep('error');
          return false;
        }
        addLog(`Split verified: ${splitId.slice(0, 20)}...`, 'success');
      } else {
        addLog('Split ID not found in mapping, proceeding...', 'warning');
      }

      // Step 3: Find Debt record in wallet
      setStep('convert');
      addLog('Searching for Debt record in wallet...', 'system');

      let debtRecordInput: string | null = null;
      let debtAmount = 0;

      try {
        const programRecords = (await requestRecords(PROGRAM_ID)) as any[];
        addLog(`Found ${programRecords?.length || 0} program records`, 'info');

        for (const r of programRecords || []) {
          if (r.spent) continue;

          const plaintext = r.plaintext || '';

          // Match Debt record by salt or split_id
          const matchesSalt = plaintext.includes(params.salt) || r.data?.salt === params.salt;
          const matchesSplitId = splitId && (plaintext.includes(splitId) || r.data?.split_id === splitId);

          if (matchesSalt || matchesSplitId) {
            // Verify this is a Debt record (has creditor field, no participant_count)
            const isDebt = (plaintext.includes('creditor') || r.data?.creditor) &&
                          !(plaintext.includes('participant_count') || r.data?.participant_count);

            if (isDebt) {
              debtRecordInput = r.plaintext || r.ciphertext;
              // Extract amount from the debt record
              const amountMatch = plaintext.match(/amount:\s*(\d+)u64/);
              if (amountMatch?.[1]) debtAmount = parseInt(amountMatch[1]);
              addLog('Found matching Debt record', 'success');
              break;
            }
          }
        }
      } catch (err: any) {
        addLog(`Record fetch: ${err.message}`, 'warning');
      }

      if (!debtRecordInput) {
        setError('No Debt record found in your wallet. The split creator must issue a debt to you first.');
        addLog('Debt record not found — creator must issue debt first', 'error');
        setStep('error');
        return false;
      }

      // Step 4: Find suitable credits record
      addLog('Searching for private credit records...', 'system');

      const amountMicro = debtAmount || parseInt(params.amount);

      let records: any[];
      try {
        records = (await requestRecords('credits.aleo')) as any[];
        addLog(`Found ${records?.length || 0} credit records`, 'info');
      } catch (err: any) {
        addLog(`Credit record fetch failed: ${err.message}`, 'error');
        setError('Failed to fetch credit records from wallet');
        setStep('error');
        return false;
      }

      let payRecord: any = null;
      for (const r of records || []) {
        if (r.spent) continue;

        let val = getMicrocredits(r);

        // Try decrypting if no plaintext
        if (val === 0 && r.recordCiphertext && !r.plaintext && decrypt) {
          try {
            const decrypted = await decrypt(r.recordCiphertext);
            if (decrypted) {
              r.plaintext = decrypted;
              val = getMicrocredits(r);
            }
          } catch { /* continue */ }
        }

        if (val > amountMicro) {
          payRecord = r;
          addLog(`Found credits record with ${val} microcredits`, 'success');
          break;
        }
      }

      // Retry once after a short delay (records may be syncing)
      if (!payRecord) {
        addLog('No suitable credits record found, retrying...', 'warning');
        await new Promise((r) => setTimeout(r, 2000));
        try {
          records = (await requestRecords('credits.aleo')) as any[];
          for (const r of records || []) {
            if (r.spent) continue;
            const val = getMicrocredits(r);
            if (val > amountMicro) {
              payRecord = r;
              addLog(`Found credits record with ${val} microcredits on retry`, 'success');
              break;
            }
          }
        } catch { /* ignore */ }
      }

      if (!payRecord) {
        addLog('No private record large enough. Try converting public credits first.', 'error');
        setError(`No private credit record with > ${amountMicro} microcredits. Convert public credits to private first.`);
        setStep('error');
        return false;
      }

      const creditsInput = getRecordPlaintext(payRecord);
      if (!creditsInput) {
        setError('Could not extract credits record data. Try refreshing wallet.');
        setStep('error');
        return false;
      }

      // Step 5: Execute pay_debt(debt_record, credits_record)
      setStep('pay');
      addLog('Executing pay_debt transaction...', 'system');

      // pay_debt takes exactly 2 inputs: Debt record + credits record
      const inputs = [debtRecordInput, creditsInput];

      addLog(`Debt record: ${debtRecordInput.slice(0, 40)}...`, 'info');
      addLog(`Credits record: ${creditsInput.slice(0, 40)}...`, 'info');

      const transaction: TransactionOptions = {
        program: PROGRAM_ID,
        function: 'pay_debt',
        inputs: inputs,
        fee: 100_000,
        privateFee: false,
      };

      console.log('PrivateSplit pay_debt payload:', JSON.stringify(transaction));
      const txResult = await executeTransaction(transaction);

      const resultTxId = txResult?.transactionId;
      setTxId(resultTxId || null);
      addLog(`Transaction submitted: ${resultTxId}`, 'success');

      // Poll for confirmation
      if (resultTxId) {
        addLog('Waiting for on-chain confirmation...', 'system');

        let confirmed = false;

        if (wallet?.adapter?.transactionStatus) {
          let attempts = 0;
          while (!confirmed && attempts < 120) {
            attempts++;
            await new Promise((r) => setTimeout(r, 1000));
            try {
              const statusRes: any = await wallet.adapter.transactionStatus(resultTxId);
              const statusStr = (typeof statusRes === 'string'
                ? statusRes
                : statusRes?.status || ''
              ).toLowerCase();

              if ((statusRes as any)?.transactionId) {
                setTxId((statusRes as any).transactionId);
              }

              if (statusStr === 'completed' || statusStr === 'finalized' || statusStr === 'accepted') {
                confirmed = true;
              } else if (statusStr === 'failed' || statusStr === 'rejected') {
                throw new Error('Transaction rejected on-chain');
              }

              if (attempts % 10 === 0) {
                addLog(`Polling... attempt ${attempts}/120`, 'info');
              }
            } catch (pollErr: any) {
              if (pollErr?.message?.includes('rejected')) throw pollErr;
            }
          }
        } else {
          confirmed = await pollTransaction(resultTxId, (msg) => addLog(msg, 'info'));
        }

        if (confirmed) {
          addLog('Payment confirmed on-chain!', 'success');
          setStep('success');

          if (splitId) {
            api.updateSplit(splitId, {
              payment_count: (await getSplitStatus(splitId))?.payment_count || 1,
            }).catch(() => {});
          }

          return true;
        } else {
          addLog('Transaction polling timed out. Check explorer.', 'warning');
          setStep('success');
          return true;
        }
      }

      setStep('success');
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Payment failed';
      setError(msg);
      addLog(`Error: ${msg}`, 'error');
      setStep('error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [address, executeTransaction, requestRecords, decrypt, wallet, addLog]);

  return { pay, step, loading, error, txId };
}
