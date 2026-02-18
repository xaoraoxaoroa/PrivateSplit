import { useNavigate } from 'react-router-dom';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TerminalCard, LogEntry } from '../components/ui';
import { SplitForm } from '../components/split/SplitForm';
import { useCreateSplit } from '../hooks/useCreateSplit';
import { useUIStore } from '../store/splitStore';
import { STATUS_SYMBOLS } from '../design-system/tokens';
import { Link } from 'react-router-dom';
import { TerminalButton } from '../components/ui';

export function CreateSplit() {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { createSplit, loading, error } = useCreateSplit();
  const logs = useUIStore((s) => s.logs);

  const handleSubmit = async (data: {
    description: string;
    amount: string;
    participantCount: number;
    participants: string[];
  }) => {
    const split = await createSplit(data);
    if (split && split.split_id && split.split_id !== 'null') {
      // Navigate to split detail after short delay
      setTimeout(() => navigate(`/split/${split.split_id}`), 1500);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-lg text-terminal-green tracking-wider">CREATE SPLIT</h1>
        <TerminalCard>
          <p className="text-xs text-terminal-dim text-center py-6">
            {STATUS_SYMBOLS.pending} Connect your Shield Wallet to create a split
          </p>
          <Link to="/connect">
            <TerminalButton variant="secondary" className="w-full">CONNECT WALLET</TerminalButton>
          </Link>
        </TerminalCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-lg text-terminal-green tracking-wider">CREATE SPLIT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <SplitForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <p className="text-terminal-red text-xs mt-2">{STATUS_SYMBOLS.error} {error}</p>
          )}
        </div>

        {/* Transaction Log */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xs text-terminal-dim tracking-widest uppercase">Transaction Log</h2>
          <TerminalCard className="max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-terminal-dim py-4 text-center">
                {STATUS_SYMBOLS.pending} Ready to execute...
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
