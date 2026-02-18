import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TerminalCard, TerminalButton, LogEntry } from '../components/ui';
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
  const [recentSplits, setRecentSplits] = useState<Split[]>([]);

  const mySplits = localSplits.filter((s) => s.creator === address);
  const activeSplits = mySplits.filter((s) => s.status === 'active');
  const settledSplits = mySplits.filter((s) => s.status === 'settled');
  const totalVolume = mySplits.reduce((sum, s) => sum + s.total_amount, 0);

  useEffect(() => {
    api.getRecentSplits().then(setRecentSplits).catch(() => {});
  }, []);

  // Hero for unauthenticated users
  if (!connected) {
    return (
      <div className="space-y-10 animate-fade-in">
        {/* Hero */}
        <div className="glass-card glass-card-accent p-8 md:p-14 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terminal-green/10 border border-terminal-green/20 text-terminal-green text-[10px] font-medium tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-green pulse-dot" />
              Built on Aleo
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient cursor-blink mb-4">
            PrivateSplit
          </h1>
          <p className="text-sm text-terminal-text mb-1">
            Split bills privately on Aleo.
          </p>
          <p className="text-xs text-terminal-dim max-w-md mx-auto mb-8">
            Your share amounts, participants, and payments stay encrypted using zero-knowledge proofs.
            Only you see your records.
          </p>
          <Link to="/connect">
            <TerminalButton className="px-8">CONNECT WALLET</TerminalButton>
          </Link>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TerminalCard variant="stat" className="stagger-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-terminal-green/10 border border-terminal-green/20 flex items-center justify-center text-terminal-green font-bold text-sm">
                01
              </div>
              <p className="text-xs text-terminal-text font-medium">CREATE A SPLIT</p>
            </div>
            <p className="text-[11px] text-terminal-dim leading-relaxed">
              Set the total amount and number of participants. Everything stays encrypted in Aleo records.
            </p>
          </TerminalCard>
          <TerminalCard variant="stat" className="stagger-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-terminal-cyan/10 border border-terminal-cyan/20 flex items-center justify-center text-terminal-cyan font-bold text-sm">
                02
              </div>
              <p className="text-xs text-terminal-text font-medium">ISSUE DEBTS</p>
            </div>
            <p className="text-[11px] text-terminal-dim leading-relaxed">
              Send Debt records to participants. Zero on-chain trace &mdash; no finalize block, no public data.
            </p>
          </TerminalCard>
          <TerminalCard variant="stat" className="stagger-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-terminal-purple/10 border border-terminal-purple/20 flex items-center justify-center text-terminal-purple font-bold text-sm">
                03
              </div>
              <p className="text-xs text-terminal-text font-medium">PAY & SETTLE</p>
            </div>
            <p className="text-[11px] text-terminal-dim leading-relaxed">
              Participants pay via private transfer. Both parties get encrypted receipts as proof.
            </p>
          </TerminalCard>
        </div>

        {/* Privacy stats */}
        <TerminalCard variant="accent">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'AMOUNTS ON-CHAIN', value: '0' },
              { label: 'ADDRESSES ON-CHAIN', value: '0' },
              { label: 'DEBTS VISIBLE', value: '0' },
              { label: 'PAYMENTS TRACEABLE', value: '0' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-bold text-terminal-green mb-1">{item.value}</p>
                <p className="text-[10px] text-terminal-dim tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </TerminalCard>

        {/* Recent Network Activity */}
        {recentSplits.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs text-terminal-dim tracking-wider uppercase font-medium">Recent Network Activity</h2>
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

  // Authenticated dashboard
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gradient">Dashboard</h1>
          <p className="text-xs text-terminal-dim mt-1">Manage your private expense splits</p>
        </div>
        <Link to="/create">
          <TerminalButton>NEW SPLIT</TerminalButton>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <TerminalCard variant="stat" className="stagger-1">
          <p className="text-[10px] text-terminal-dim tracking-wider uppercase font-medium">Active</p>
          <p className="text-2xl text-terminal-cyan font-bold mt-2">{activeSplits.length}</p>
        </TerminalCard>
        <TerminalCard variant="stat" className="stagger-2">
          <p className="text-[10px] text-terminal-dim tracking-wider uppercase font-medium">Settled</p>
          <p className="text-2xl text-terminal-green font-bold mt-2">{settledSplits.length}</p>
        </TerminalCard>
        <TerminalCard variant="stat" className="stagger-3">
          <p className="text-[10px] text-terminal-dim tracking-wider uppercase font-medium">Total</p>
          <p className="text-2xl text-terminal-text font-bold mt-2">{mySplits.length}</p>
        </TerminalCard>
        <TerminalCard variant="stat" className="stagger-4">
          <p className="text-[10px] text-terminal-dim tracking-wider uppercase font-medium">Volume</p>
          <p className="text-2xl text-terminal-amber font-bold mt-2">{microToCredits(totalVolume)}</p>
        </TerminalCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Splits */}
        <div className="space-y-4">
          <h2 className="text-xs text-terminal-dim tracking-wider uppercase font-medium">Active Splits</h2>
          {activeSplits.length === 0 ? (
            <TerminalCard>
              <div className="py-4 text-center">
                <p className="text-sm text-terminal-text mb-2">No active splits</p>
                <p className="text-xs text-terminal-dim mb-4">
                  Create your first split to start splitting expenses privately.
                </p>
                <Link to="/create">
                  <TerminalButton className="w-full">CREATE YOUR FIRST SPLIT</TerminalButton>
                </Link>
              </div>
            </TerminalCard>
          ) : (
            <div className="space-y-3">
              {activeSplits.map((split) => <SplitCard key={split.split_id} split={split} />)}
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div className="space-y-4">
          <h2 className="text-xs text-terminal-dim tracking-wider uppercase font-medium">Activity Log</h2>
          <TerminalCard className="max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-terminal-dim py-6 text-center">
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

      {/* Recent Network Activity */}
      {recentSplits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs text-terminal-dim tracking-wider uppercase font-medium">Recent Network Activity</h2>
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
