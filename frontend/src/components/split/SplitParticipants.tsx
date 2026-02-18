import { TerminalCard, TerminalBadge } from '../ui';
import { truncateAddress, microToCredits } from '../../utils/format';
import type { Participant } from '../../types/split';

interface SplitParticipantsProps {
  participants: Participant[];
  perPerson: number;
  creator: string;
}

export function SplitParticipants({ participants, perPerson, creator }: SplitParticipantsProps) {
  return (
    <TerminalCard title="PARTICIPANTS">
      <div className="space-y-2">
        {/* Creator row */}
        <div className="flex items-center justify-between py-1.5 border-b border-terminal-border">
          <div className="flex items-center gap-2">
            <span className="text-terminal-cyan text-xs">CREATOR</span>
            <span className="text-xs text-terminal-text">{truncateAddress(creator)}</span>
          </div>
          <span className="text-xs text-terminal-dim">receives payments</span>
        </div>

        {/* Participant rows */}
        {participants.map((p, i) => (
          <div key={p.address || i} className="flex items-center justify-between py-1.5 border-b border-terminal-border last:border-0">
            <div className="flex items-center gap-2">
              <span className="text-terminal-dim text-xs">#{i + 1}</span>
              <span className="text-xs text-terminal-text">
                {p.label || truncateAddress(p.address)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-terminal-dim">{microToCredits(perPerson)} cr</span>
              <TerminalBadge status={p.paid ? 'success' : 'pending'} label={p.paid ? 'PAID' : 'OWES'} />
            </div>
          </div>
        ))}
      </div>
    </TerminalCard>
  );
}
