import { useParams, Link } from 'react-router-dom';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TerminalCard, TerminalButton, TerminalBadge, LogEntry } from '../components/ui';
import { SplitParticipants } from '../components/split/SplitParticipants';
import { useSplitStore, useUIStore } from '../store/splitStore';
import { useSplitStatus } from '../hooks/useSplitStatus';
import { useSettleSplit } from '../hooks/useSettleSplit';
import { useIssueDebt } from '../hooks/useIssueDebt';
import { microToCredits, truncateAddress } from '../utils/format';
import { STATUS_SYMBOLS } from '../design-system/tokens';
import { useState } from 'react';

export function SplitDetail() {
  const { hash } = useParams<{ hash: string }>();
  const { address } = useWallet();
  const split = useSplitStore((s) => s.getSplit(hash || ''));
  const { data: onChainStatus, refresh, loading: statusLoading } = useSplitStatus(hash);
  const { settleSplit, loading: settleLoading } = useSettleSplit();
  const { issueDebt, loading: issueLoading } = useIssueDebt();
  const logs = useUIStore((s) => s.logs);
  const [copied, setCopied] = useState(false);
  const [issuingTo, setIssuingTo] = useState<string | null>(null);

  if (!split) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-lg text-terminal-amber tracking-wider">SPLIT NOT FOUND</h1>
        <TerminalCard>
          <p className="text-xs text-terminal-dim py-4 text-center">
            {STATUS_SYMBOLS.error} Split {hash?.slice(0, 20)}... not found locally.
          </p>
          <Link to="/">
            <TerminalButton variant="secondary" className="w-full">BACK TO DASHBOARD</TerminalButton>
          </Link>
        </TerminalCard>
      </div>
    );
  }

  const isCreator = address === split.creator;
  const shareUrl = `${window.location.origin}/pay?creator=${split.creator}&amount=${split.per_person}&salt=${split.salt}&split_id=${split.split_id}&desc=${encodeURIComponent(split.description || '')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSettle = () => {
    settleSplit(split.split_id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg text-terminal-green tracking-wider">
            {split.description || 'SPLIT DETAIL'}
          </h1>
          <p className="text-xs text-terminal-dim mt-1">
            ID: {split.split_id.slice(0, 24)}...
          </p>
        </div>
        <TerminalBadge
          status={split.status === 'settled' ? 'settled' : 'active'}
        />
      </div>

      {/* Split Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TerminalCard title="SPLIT INFO">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Total</span>
              <span className="text-terminal-green">{microToCredits(split.total_amount)} credits</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Per Person</span>
              <span className="text-terminal-text">{microToCredits(split.per_person)} credits</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Participants</span>
              <span className="text-terminal-text">{split.participant_count}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-terminal-dim">Creator</span>
              <span className="text-terminal-text">{truncateAddress(split.creator)}</span>
            </div>
            {split.transaction_id && (
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">TX</span>
                <a
                  href={`https://testnet.explorer.provable.com/transaction/${split.transaction_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terminal-cyan hover:underline"
                >
                  {truncateAddress(split.transaction_id, 8)}
                </a>
              </div>
            )}
          </div>
        </TerminalCard>

        <TerminalCard title="ON-CHAIN STATUS">
          {onChainStatus ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Payments</span>
                <span className="text-terminal-green">
                  {onChainStatus.payment_count}/{onChainStatus.participant_count - 1}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Status</span>
                <TerminalBadge status={onChainStatus.status === 1 ? 'settled' : 'active'} />
              </div>
              <TerminalButton variant="secondary" onClick={refresh} loading={statusLoading} className="w-full mt-2">
                REFRESH
              </TerminalButton>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-xs text-terminal-dim text-center">
                {STATUS_SYMBOLS.pending} Checking on-chain status...
              </p>
              <TerminalButton variant="secondary" onClick={refresh} loading={statusLoading} className="w-full mt-2">
                CHECK STATUS
              </TerminalButton>
            </div>
          )}
        </TerminalCard>
      </div>

      {/* Participants */}
      {split.participants && split.participants.length > 0 && (
        <SplitParticipants
          participants={split.participants}
          perPerson={split.per_person}
          creator={split.creator}
        />
      )}

      {/* Share Link */}
      <TerminalCard title="PAYMENT LINK">
        <div className="space-y-3">
          <div className="bg-terminal-bg border border-terminal-border p-2 text-xs text-terminal-dim break-all">
            {shareUrl}
          </div>
          <TerminalButton onClick={handleCopy} variant="secondary" className="w-full">
            {copied ? 'COPIED!' : 'COPY LINK'}
          </TerminalButton>
        </div>
      </TerminalCard>

      {/* Issue Debts — Creator can issue debts to each participant */}
      {isCreator && split.status === 'active' && split.participants && split.participants.length > 0 && (
        <TerminalCard title="ISSUE DEBTS">
          <p className="text-xs text-terminal-dim mb-3">
            Issue on-chain debt records to each participant. They'll see the debt in their wallet and can pay it.
          </p>
          <div className="space-y-2">
            {split.participants.filter((p) => p.address !== address).map((p) => (
              <div key={p.address} className="flex items-center justify-between gap-2 border border-terminal-border p-2">
                <span className="text-xs text-terminal-text truncate flex-1">
                  {truncateAddress(p.address, 10)}
                </span>
                <span className="text-xs text-terminal-dim">
                  {microToCredits(split.per_person)} cr
                </span>
                <TerminalButton
                  variant="primary"
                  onClick={async () => {
                    setIssuingTo(p.address);
                    await issueDebt(split.split_id, p.address);
                    setIssuingTo(null);
                  }}
                  loading={issueLoading && issuingTo === p.address}
                  className="text-xs px-2 py-1"
                >
                  ISSUE DEBT
                </TerminalButton>
              </div>
            ))}
          </div>
        </TerminalCard>
      )}

      {/* Creator Actions */}
      {isCreator && split.status === 'active' && (
        <TerminalButton onClick={handleSettle} loading={settleLoading} variant="danger" className="w-full">
          SETTLE SPLIT
        </TerminalButton>
      )}

      {/* Activity Log */}
      {logs.length > 0 && (
        <TerminalCard title="ACTIVITY LOG" className="max-h-48 overflow-y-auto">
          <div className="space-y-1">
            {logs.slice(-10).map((entry) => (
              <LogEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </TerminalCard>
      )}
    </div>
  );
}
