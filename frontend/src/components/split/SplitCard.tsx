import { Link } from 'react-router-dom';
import { TerminalCard, TerminalBadge } from '../ui';
import { microToCredits, truncateAddress } from '../../utils/format';
import type { Split } from '../../types/split';

interface SplitCardProps {
  split: Split;
}

export function SplitCard({ split }: SplitCardProps) {
  const paidCount = split.payment_count || 0;
  const totalDebts = Math.max(split.participant_count - 1, 1);
  const progress = Math.round((paidCount / totalDebts) * 100);

  return (
    <Link to={`/split/${split.split_id}`}>
      <TerminalCard hoverable>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-terminal-text font-medium">{split.description || 'Untitled Split'}</p>
            <p className="text-[10px] text-terminal-dim mt-1 font-mono">
              {truncateAddress(split.creator)} &middot; {split.participant_count} participants
            </p>
          </div>
          <TerminalBadge status={split.status === 'settled' ? 'settled' : paidCount >= totalDebts ? 'success' : 'active'} />
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/[0.04] rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-terminal-green rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-terminal-green font-semibold">{microToCredits(split.total_amount)} credits</span>
          <span className="text-terminal-dim font-mono">
            {paidCount}/{totalDebts} paid &middot; {microToCredits(split.per_person)} each
          </span>
        </div>
      </TerminalCard>
    </Link>
  );
}
