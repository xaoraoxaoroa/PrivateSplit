import { useNavigate } from 'react-router-dom';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TerminalCard, TerminalButton, LogEntry } from '../components/ui';
import { SplitForm } from '../components/split/SplitForm';
import { useCreateSplit } from '../hooks/useCreateSplit';
import { useUIStore } from '../store/splitStore';
import { STATUS_SYMBOLS } from '../design-system/tokens';
import { Link } from 'react-router-dom';

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
    if (split && split.split_id && split.split_id !== 'null' && !split.split_id.startsWith('pending_')) {
      setTimeout(() => navigate(`/split/${split.split_id}`), 1500);
    } else if (split) {
      setTimeout(() => navigate('/'), 1500);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-xl font-bold text-gradient">Create Split</h1>
        <TerminalCard>
          <div className="py-8 text-center">
            <p className="text-sm text-terminal-text mb-2">Wallet Required</p>
            <p className="text-xs text-terminal-dim mb-4">
              Connect your Shield Wallet to create a private expense split.
            </p>
            <Link to="/connect">
              <TerminalButton variant="secondary" className="w-full">CONNECT WALLET</TerminalButton>
            </Link>
          </div>
        </TerminalCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-gradient">Create Split</h1>
        <p className="text-xs text-terminal-dim mt-1">All data is encrypted in Aleo records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <SplitForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <p className="text-terminal-red text-xs mt-3">{STATUS_SYMBOLS.error} {error}</p>
          )}
        </div>

        {/* Transaction Log */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs text-terminal-dim tracking-wider uppercase font-medium">Transaction Log</h2>
          <TerminalCard className="max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-terminal-dim py-6 text-center">
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
