import { useState } from 'react';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TerminalCard, TerminalButton } from '../components/ui';
import { SplitCard } from '../components/split/SplitCard';
import { useSplitStore } from '../store/splitStore';
import { STATUS_SYMBOLS } from '../design-system/tokens';
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
        <h1 className="text-lg text-terminal-green tracking-wider">HISTORY</h1>
        <TerminalCard>
          <p className="text-xs text-terminal-dim text-center py-6">
            {STATUS_SYMBOLS.pending} Connect wallet to view history
          </p>
          <Link to="/connect">
            <TerminalButton variant="secondary" className="w-full">CONNECT WALLET</TerminalButton>
          </Link>
        </TerminalCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-lg text-terminal-green tracking-wider">HISTORY</h1>
        <div className="flex items-center gap-1">
          {(['all', 'active', 'settled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs tracking-wider border transition-colors ${
                filter === f
                  ? 'border-terminal-green text-terminal-green'
                  : 'border-terminal-border text-terminal-dim hover:text-terminal-text'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <TerminalCard>
          <p className="text-xs text-terminal-dim text-center py-6">
            {STATUS_SYMBOLS.pending} No {filter === 'all' ? '' : filter + ' '}splits found
          </p>
          <Link to="/create">
            <TerminalButton variant="secondary" className="w-full">CREATE A SPLIT</TerminalButton>
          </Link>
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
