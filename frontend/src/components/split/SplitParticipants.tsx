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
      <div className="space-y-0">
        {/* Creator row */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-terminal-cyan/10 border border-terminal-cyan/20 flex items-center justify-center">
              <span className="text-terminal-cyan text-[10px] font-bold">C</span>
            </div>
            <div>
              <span className="text-xs text-terminal-text font-medium">{truncateAddress(creator)}</span>
              <span className="text-[10px] text-terminal-cyan ml-2">Creator</span>
            </div>
          </div>
          <span className="text-xs text-terminal-dim">receives payments</span>
        </div>

        {/* Participant rows */}
        {participants.map((p, i) => (
          <div key={p.address || i} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <span className="text-terminal-dim text-[10px] font-bold">{i + 1}</span>
              </div>
              <span className="text-xs text-terminal-text">
                {p.label || truncateAddress(p.address)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-terminal-dim font-mono">{microToCredits(perPerson)} cr</span>
              <TerminalBadge status={p.paid ? 'success' : 'pending'} label={p.paid ? 'PAID' : 'OWES'} />
            </div>
          </div>
        ))}
      </div>
    </TerminalCard>
  );
}
