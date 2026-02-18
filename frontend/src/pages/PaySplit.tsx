import { useSearchParams } from 'react-router-dom';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TerminalCard, TerminalButton, TerminalProgress, LogEntry } from '../components/ui';
import { usePaySplit } from '../hooks/usePaySplit';
import { useUIStore } from '../store/splitStore';
import { microToCredits, truncateAddress } from '../utils/format';
import { STATUS_SYMBOLS } from '../design-system/tokens';
import { Link } from 'react-router-dom';

export function PaySplit() {
  const [params] = useSearchParams();
  const { connected } = useWallet();
  const { pay, step, loading, error, txId } = usePaySplit();
  const logs = useUIStore((s) => s.logs);

  const creator = params.get('creator') || '';
  const amount = params.get('amount') || '0';
  const salt = params.get('salt') || '';
  const splitId = params.get('split_id') || '';
  const description = params.get('desc') || 'Expense Split';

  const handlePay = () => {
    pay({ creator, amount, salt, splitId: splitId || undefined });
  };

  if (!creator || !amount || !salt) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-lg text-terminal-red tracking-wider">INVALID PAYMENT LINK</h1>
        <TerminalCard variant="error">
          <p className="text-xs text-terminal-dim py-4">
            {STATUS_SYMBOLS.error} Missing required parameters (creator, amount, salt).
          </p>
          <Link to="/">
            <TerminalButton variant="secondary" className="w-full">BACK TO DASHBOARD</TerminalButton>
          </Link>
        </TerminalCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-lg text-terminal-green tracking-wider">PAY SPLIT</h1>

      {/* Progress */}
      <TerminalProgress currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Payment Info */}
        <div className="lg:col-span-3 space-y-4">
          <TerminalCard title="PAYMENT DETAILS">
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Description</span>
                <span className="text-terminal-text">{description}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Amount</span>
                <span className="text-terminal-green">{microToCredits(parseInt(amount))} credits</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Pay to</span>
                <span className="text-terminal-text">{truncateAddress(creator)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Network</span>
                <span className="text-terminal-cyan">Aleo Testnet</span>
              </div>
            </div>
          </TerminalCard>

          {!connected ? (
            <Link to="/connect">
              <TerminalButton variant="secondary" className="w-full">CONNECT WALLET FIRST</TerminalButton>
            </Link>
          ) : step === 'success' ? (
            <TerminalCard variant="accent">
              <div className="text-center py-2">
                <p className="text-terminal-green text-sm">{STATUS_SYMBOLS.success} Payment Confirmed</p>
                {txId && (
                  <p className="text-xs text-terminal-dim mt-2">
                    TX: {truncateAddress(txId, 10)}
                  </p>
                )}
                <Link to="/" className="block mt-3">
                  <TerminalButton variant="secondary">BACK TO DASHBOARD</TerminalButton>
                </Link>
              </div>
            </TerminalCard>
          ) : (
            <TerminalButton onClick={handlePay} loading={loading} className="w-full">
              EXECUTE PAYMENT
            </TerminalButton>
          )}

          {error && (
            <p className="text-terminal-red text-xs">{STATUS_SYMBOLS.error} {error}</p>
          )}
        </div>

        {/* Transaction Log */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xs text-terminal-dim tracking-widest uppercase">Transaction Log</h2>
          <TerminalCard className="max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-terminal-dim py-4 text-center">
                {STATUS_SYMBOLS.pending} Awaiting execution...
              </p>
            ) : (
              <div className="space-y-1">
                {logs.map((entry) => (
                  <LogEntry key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </TerminalCard>
        </div>
      </div>
    </div>
  );
}
