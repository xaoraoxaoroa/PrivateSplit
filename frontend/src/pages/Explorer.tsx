import { useState } from 'react';
import { TerminalCard, TerminalInput, TerminalButton, TerminalBadge } from '../components/ui';
import { getSplitStatus, getSplitIdFromMapping } from '../utils/aleo-utils';
import { STATUS_SYMBOLS } from '../design-system/tokens';
import { PROGRAM_ID, TESTNET_API } from '../utils/constants';

interface SplitResult {
  split_id: string;
  participant_count: number;
  payment_count: number;
  status: number;
}

interface TxResult {
  id: string;
  type: string;
  status: string;
}

export function Explorer() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'split_id' | 'salt' | 'tx'>('split_id');
  const [loading, setLoading] = useState(false);
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);
  const [txResult, setTxResult] = useState<TxResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSplitResult(null);
    setTxResult(null);

    try {
      if (searchType === 'salt') {
        const splitId = await getSplitIdFromMapping(query.trim());
        if (!splitId) {
          setError('No split found for this salt');
          return;
        }
        const status = await getSplitStatus(splitId);
        if (status) {
          setSplitResult({ split_id: splitId, ...status });
        } else {
          setError('Split found but status unavailable');
        }
      } else if (searchType === 'split_id') {
        const status = await getSplitStatus(query.trim());
        if (status) {
          setSplitResult({ split_id: query.trim(), ...status });
        } else {
          setError('Split not found on-chain');
        }
      } else if (searchType === 'tx') {
        const res = await fetch(`${TESTNET_API}/transaction/${query.trim()}`);
        if (!res.ok) {
          setError('Transaction not found');
          return;
        }
        const data = await res.json();
        setTxResult({
          id: data.id || query.trim(),
          type: data.type || 'unknown',
          status: data.status || 'confirmed',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const searchTypes = [
    { key: 'split_id' as const, label: 'Split ID' },
    { key: 'salt' as const, label: 'Salt' },
    { key: 'tx' as const, label: 'TX Hash' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-gradient">Explorer</h1>
        <p className="text-xs text-terminal-dim mt-1">
          Verify splits and transactions on-chain
        </p>
      </div>

      {/* Search */}
      <TerminalCard title="ON-CHAIN LOOKUP">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
            {searchTypes.map((t) => (
              <button
                key={t.key}
                onClick={() => { setSearchType(t.key); setSplitResult(null); setTxResult(null); setError(null); }}
                className={`px-3 py-1.5 text-xs font-medium tracking-wide rounded-lg border transition-colors ${
                  searchType === t.key
                    ? 'border-terminal-green/40 text-terminal-green bg-terminal-green/10'
                    : 'border-white/[0.06] text-terminal-dim hover:text-terminal-text hover:bg-white/[0.03]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <TerminalInput
                placeholder={
                  searchType === 'split_id' ? 'Enter split_id field value...'
                    : searchType === 'salt' ? 'Enter salt field value...'
                    : 'Enter transaction hash...'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <TerminalButton onClick={handleSearch} loading={loading}>
              SEARCH
            </TerminalButton>
          </div>
        </div>
      </TerminalCard>

      {/* Quick Links */}
      {!splitResult && !txResult && !error && (
        <TerminalCard title="QUICK LOOKUP">
          <div className="space-y-2 text-xs">
            <p className="text-terminal-dim">Try one of these confirmed on-chain items:</p>
            <button
              onClick={() => { setQuery('1904758949858929157912240259749859140762221531679669196161601694830550064831field'); setSearchType('split_id'); }}
              className="block text-terminal-cyan hover:text-terminal-green text-left break-all transition-colors"
            >
              {STATUS_SYMBOLS.arrow} Split: 19047589498...064831field
            </button>
            <button
              onClick={() => { setQuery('987654321098765field'); setSearchType('salt'); }}
              className="block text-terminal-cyan hover:text-terminal-green text-left transition-colors"
            >
              {STATUS_SYMBOLS.arrow} Salt: 987654321098765field
            </button>
            <button
              onClick={() => { setQuery('at1ue3v4t5u9rsmf7h7jnee8dhr6dguda59lrct68j3d4rjhm395vqqhjwcxv'); setSearchType('tx'); }}
              className="block text-terminal-cyan hover:text-terminal-green text-left break-all transition-colors"
            >
              {STATUS_SYMBOLS.arrow} TX: at1ue3v4t5u...hjwcxv
            </button>
          </div>
        </TerminalCard>
      )}

      {/* Error */}
      {error && (
        <TerminalCard variant="error">
          <p className="text-xs text-terminal-red flex items-center gap-2">
            <span>{STATUS_SYMBOLS.error}</span> {error}
          </p>
        </TerminalCard>
      )}

      {/* Split Result */}
      {splitResult && (
        <TerminalCard title="SPLIT STATUS" variant="accent">
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Split ID</span>
              <span className="text-terminal-text break-all text-right max-w-[60%] font-mono">
                {splitResult.split_id}
              </span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-terminal-dim">Status</span>
              <TerminalBadge status={splitResult.status === 1 ? 'settled' : 'active'} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Participants</span>
              <span className="text-terminal-text">{splitResult.participant_count}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Payments Received</span>
              <span className="text-terminal-green font-mono">
                {splitResult.payment_count} / {splitResult.participant_count - 1}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full bg-terminal-green rounded-full transition-all"
                style={{ width: `${Math.round((splitResult.payment_count / Math.max(splitResult.participant_count - 1, 1)) * 100)}%` }}
              />
            </div>

            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-[10px] text-terminal-dim tracking-wider uppercase mb-2">Verification</p>
              <div className="space-y-1.5 text-xs">
                <p className="text-terminal-green flex items-center gap-2">
                  <span>{STATUS_SYMBOLS.success}</span> Split exists on-chain
                </p>
                <p className="text-terminal-green flex items-center gap-2">
                  <span>{STATUS_SYMBOLS.success}</span> Data from mapping: {PROGRAM_ID}/splits
                </p>
                <p className={`flex items-center gap-2 ${splitResult.status === 1 ? 'text-terminal-cyan' : 'text-terminal-amber'}`}>
                  <span>{splitResult.status === 1 ? STATUS_SYMBOLS.success : STATUS_SYMBOLS.pending}</span>
                  {splitResult.status === 1 ? 'Split is settled (final)' : 'Split is active (accepting payments)'}
                </p>
              </div>
            </div>
          </div>
        </TerminalCard>
      )}

      {/* Transaction Result */}
      {txResult && (
        <TerminalCard title="TRANSACTION" variant="accent">
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Transaction ID</span>
              <a
                href={`https://testnet.explorer.provable.com/transaction/${txResult.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-cyan hover:text-terminal-green break-all text-right max-w-[60%] font-mono transition-colors"
              >
                {txResult.id}
              </a>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Type</span>
              <span className="text-terminal-text">{txResult.type}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Status</span>
              <span className="text-terminal-green">{STATUS_SYMBOLS.success} {txResult.status}</span>
            </div>
          </div>
        </TerminalCard>
      )}

      {/* Program Info */}
      <TerminalCard title="PROGRAM INFO">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-terminal-dim">Program</span>
            <span className="text-terminal-text font-mono">{PROGRAM_ID}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-terminal-dim">Network</span>
            <span className="text-terminal-cyan">Aleo Testnet</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-terminal-dim">Mappings</span>
            <span className="text-terminal-text font-mono">splits, split_salts</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-terminal-dim">Transitions</span>
            <span className="text-terminal-text">create_split, issue_debt, pay_debt, settle_split, verify_split</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-terminal-dim">Records</span>
            <span className="text-terminal-text">Split, Debt, PayerReceipt, CreatorReceipt</span>
          </div>
          <div className="border-t border-white/[0.06] pt-3 mt-3">
            <a
              href={`https://testnet.explorer.provable.com/program/${PROGRAM_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-terminal-cyan hover:text-terminal-green transition-colors"
            >
              {STATUS_SYMBOLS.arrow} View on Provable Explorer
            </a>
          </div>
        </div>
      </TerminalCard>

      {/* Privacy Info */}
      <TerminalCard title="PRIVACY MODEL">
        <div className="space-y-2 text-xs">
          <p className="text-terminal-green flex items-center gap-2"><span>{STATUS_SYMBOLS.success}</span> All amounts stored in encrypted records (private)</p>
          <p className="text-terminal-green flex items-center gap-2"><span>{STATUS_SYMBOLS.success}</span> Participant identities hidden in records</p>
          <p className="text-terminal-green flex items-center gap-2"><span>{STATUS_SYMBOLS.success}</span> Payments via credits.aleo/transfer_private</p>
          <p className="text-terminal-green flex items-center gap-2"><span>{STATUS_SYMBOLS.success}</span> Only anonymous counters visible on-chain</p>
          <p className="text-terminal-dim mt-3">
            Public mappings contain: participant count, payment count, status (0/1).
            Zero amounts, zero addresses, zero private data.
          </p>
        </div>
      </TerminalCard>
    </div>
  );
}
