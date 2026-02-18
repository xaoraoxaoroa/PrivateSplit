import { cn } from '../../design-system/cn';
import { STATUS_SYMBOLS } from '../../design-system/tokens';

interface TerminalBadgeProps {
  status: 'active' | 'settled' | 'pending' | 'error' | 'success';
  label?: string;
  className?: string;
}

export function TerminalBadge({ status, label, className }: TerminalBadgeProps) {
  const config = {
    active: { symbol: STATUS_SYMBOLS.active, color: 'text-terminal-green', text: 'ACTIVE' },
    settled: { symbol: STATUS_SYMBOLS.success, color: 'text-terminal-cyan', text: 'SETTLED' },
    pending: { symbol: STATUS_SYMBOLS.pending, color: 'text-terminal-amber', text: 'PENDING' },
    error: { symbol: STATUS_SYMBOLS.error, color: 'text-terminal-red', text: 'ERROR' },
    success: { symbol: STATUS_SYMBOLS.success, color: 'text-terminal-green', text: 'SUCCESS' },
  }[status];

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-mono', config.color, className)}>
      <span>{config.symbol}</span>
      <span className="tracking-widest uppercase">{label || config.text}</span>
    </span>
  );
}
