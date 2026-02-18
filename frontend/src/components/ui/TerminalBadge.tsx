import { cn } from '../../design-system/cn';

interface TerminalBadgeProps {
  status: 'active' | 'settled' | 'pending' | 'error' | 'success';
  label?: string;
  className?: string;
}

export function TerminalBadge({ status, label, className }: TerminalBadgeProps) {
  const config = {
    active: { color: 'bg-terminal-cyan/10 text-terminal-cyan border-terminal-cyan/20', dot: 'bg-terminal-cyan', text: 'ACTIVE' },
    settled: { color: 'bg-terminal-green/10 text-terminal-green border-terminal-green/20', dot: 'bg-terminal-green', text: 'SETTLED' },
    pending: { color: 'bg-terminal-amber/10 text-terminal-amber border-terminal-amber/20', dot: 'bg-terminal-amber', text: 'PENDING' },
    error: { color: 'bg-terminal-red/10 text-terminal-red border-terminal-red/20', dot: 'bg-terminal-red', text: 'ERROR' },
    success: { color: 'bg-terminal-green/10 text-terminal-green border-terminal-green/20', dot: 'bg-terminal-green', text: 'SUCCESS' },
  }[status];

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase border rounded-full',
      config.color,
      className,
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot, status === 'active' && 'pulse-dot')} />
      <span>{label || config.text}</span>
    </span>
  );
}
