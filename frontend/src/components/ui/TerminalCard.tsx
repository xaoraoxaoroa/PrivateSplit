import { cn } from '../../design-system/cn';

interface TerminalCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'accent' | 'error';
}

export function TerminalCard({ children, title, className, variant = 'default' }: TerminalCardProps) {
  const borderColor = {
    default: 'border-terminal-border',
    accent: 'border-terminal-green',
    error: 'border-terminal-red',
  }[variant];

  return (
    <div className={cn('bg-terminal-surface border', borderColor, 'p-4', className)}>
      {title && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-terminal-border">
          <span className="text-terminal-dim text-xs tracking-widest uppercase">{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}
