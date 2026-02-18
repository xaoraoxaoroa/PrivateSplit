import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TerminalCard, TerminalButton, TerminalBadge, LogEntry } from '../components/ui';
import { SplitCard } from '../components/split/SplitCard';
import { useSplitStore, useUIStore } from '../store/splitStore';
import { microToCredits } from '../utils/format';
import { STATUS_SYMBOLS } from '../design-system/tokens';
import { api } from '../services/api';
import type { Split } from '../types/split';

export function Dashboard() {
  const { connected, address } = useWallet();
  const localSplits = useSplitStore((s) => s.splits);
  const logs = useUIStore((s) => s.logs);
  const addLog = useUIStore((s) => s.addLog);
  const [recentSplits, setRecentSplits] = useState<Split[]>([]);

  // Merge local + backend splits
  const mySplits = localSplits.filter((s) => s.creator === address);
  const activeSplits = mySplits.filter((s) => s.status === 'active');
  const settledSplits = mySplits.filter((s) => s.status === 'settled');
  const totalVolume = mySplits.reduce((sum, s) => sum + s.total_amount, 0);

  useEffect(() => {
    api.getRecentSplits().then(setRecentSplits).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg text-terminal-green tracking-wider">DASHBOARD</h1>
          <p className="text-xs text-terminal-dim mt-1">Privacy-first expense splitting on Aleo</p>
        </div>
        <Link to="/create">
          <TerminalButton>NEW SPLIT</TerminalButton>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <TerminalCard>
          <p className="text-xs text-terminal-dim tracking-widest">ACTIVE</p>
          <p className="text-2xl text-terminal-green mt-1">{activeSplits.length}</p>
        </TerminalCard>
        <TerminalCard>
          <p className="text-xs text-terminal-dim tracking-widest">SETTLED</p>
          <p className="text-2xl text-terminal-cyan mt-1">{settledSplits.length}</p>
        </TerminalCard>
        <TerminalCard>
          <p className="text-xs text-terminal-dim tracking-widest">TOTAL SPLITS</p>
          <p className="text-2xl text-terminal-text mt-1">{mySplits.length}</p>
        </TerminalCard>
        <TerminalCard>
          <p className="text-xs text-terminal-dim tracking-widest">VOLUME</p>
          <p className="text-2xl text-terminal-amber mt-1">{microToCredits(totalVolume)}</p>
        </TerminalCard>
      </div>

      {/* Two columns: Active Splits + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Splits */}
        <div className="space-y-3">
          <h2 className="text-xs text-terminal-dim tracking-widest uppercase">Active Splits</h2>
          {!connected ? (
            <TerminalCard>
              <p className="text-xs text-terminal-dim text-center py-4">
                {STATUS_SYMBOLS.pending} Connect wallet to view your splits
              </p>
              <Link to="/connect" className="block mt-2">
                <TerminalButton variant="secondary" className="w-full">CONNECT WALLET</TerminalButton>
              </Link>
            </TerminalCard>
          ) : activeSplits.length === 0 ? (
            <TerminalCard>
              <p className="text-xs text-terminal-dim text-center py-4">No active splits</p>
              <Link to="/create" className="block mt-2">
                <TerminalButton variant="secondary" className="w-full">CREATE YOUR FIRST SPLIT</TerminalButton>
              </Link>
            </TerminalCard>
          ) : (
            activeSplits.map((split) => <SplitCard key={split.split_id} split={split} />)
          )}
        </div>

        {/* Activity Log */}
        <div className="space-y-3">
          <h2 className="text-xs text-terminal-dim tracking-widest uppercase">Activity Log</h2>
          <TerminalCard className="max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-terminal-dim py-4 text-center">
                {STATUS_SYMBOLS.pending} Waiting for activity...
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

      {/* Recent Global Splits */}
      {recentSplits.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs text-terminal-dim tracking-widest uppercase">Recent Network Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentSplits.slice(0, 4).map((split) => (
              <SplitCard key={split.split_id} split={split} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
