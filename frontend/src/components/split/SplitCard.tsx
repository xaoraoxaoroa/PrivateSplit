import { Link } from 'react-router-dom';
import { TerminalCard, TerminalBadge } from '../ui';
import { microToCredits, truncateAddress } from '../../utils/format';
import { STATUS_SYMBOLS } from '../../design-system/tokens';
import type { Split } from '../../types/split';

interface SplitCardProps {
  split: Split;
}

export function SplitCard({ split }: SplitCardProps) {
  const paidCount = split.payment_count || 0;
  const totalDebts = split.participant_count - 1;

  return (
    <Link to={`/split/${split.split_id}`}>
      <TerminalCard className="hover:border-terminal-green transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-terminal-text">{split.description || 'Untitled Split'}</p>
            <p className="text-xs text-terminal-dim mt-1">
              {truncateAddress(split.creator)} {STATUS_SYMBOLS.separator} {split.participant_count} participants
            </p>
          </div>
          <TerminalBadge status={split.status === 'settled' ? 'settled' : paidCount === totalDebts ? 'success' : 'active'} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-terminal-green">{microToCredits(split.total_amount)} credits</span>
          <span className="text-terminal-dim">
            {paidCount}/{totalDebts} paid {STATUS_SYMBOLS.separator} {microToCredits(split.per_person)} each
          </span>
        </div>
      </TerminalCard>
    </Link>
  );
}
