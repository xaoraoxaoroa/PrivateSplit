import { useState } from 'react';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TerminalCard, TerminalButton } from '../components/ui';
import { SplitCard } from '../components/split/SplitCard';
import { useSplitStore } from '../store/splitStore';
import { Link } from 'react-router-dom';

type Filter = 'all' | 'active' | 'settled';

export function History() {
  const { address, connected } = useWallet();
  const splits = useSplitStore((s) => s.splits);
  const [filter, setFilter] = useState<Filter>('all');

  const mySplits = splits.filter((s) => s.creator === address);
  const filtered = filter === 'all' ? mySplits : mySplits.filter((s) => s.status === filter);

  if (!connected) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-xl font-bold text-gradient">My Splits</h1>
        <TerminalCard>
          <div className="py-8 text-center">
            <p className="text-sm text-terminal-text mb-2">Wallet Required</p>
            <p className="text-xs text-terminal-dim mb-4">Connect wallet to view your split history</p>
            <Link to="/connect">
              <TerminalButton variant="secondary" className="w-full">CONNECT WALLET</TerminalButton>
            </Link>
          </div>
        </TerminalCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gradient">My Splits</h1>
          <p className="text-xs text-terminal-dim mt-1">{mySplits.length} total splits</p>
        </div>
        <div className="flex items-center gap-1.5">
          {(['all', 'active', 'settled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium tracking-wide rounded-lg border transition-colors ${
                filter === f
                  ? 'border-terminal-green/40 text-terminal-green bg-terminal-green/10'
                  : 'border-white/[0.06] text-terminal-dim hover:text-terminal-text hover:bg-white/[0.03]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <TerminalCard>
          <div className="py-8 text-center">
            <p className="text-sm text-terminal-text mb-2">
              No {filter === 'all' ? '' : filter + ' '}splits found
            </p>
            <p className="text-xs text-terminal-dim mb-4">
              Create your first split to get started.
            </p>
            <Link to="/create">
              <TerminalButton variant="secondary" className="w-full">CREATE A SPLIT</TerminalButton>
            </Link>
          </div>
        </TerminalCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((split) => (
            <SplitCard key={split.split_id} split={split} />
          ))}
        </div>
      )}
    </div>
  );
}
