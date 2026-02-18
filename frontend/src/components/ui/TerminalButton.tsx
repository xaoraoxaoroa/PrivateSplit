import { cn } from '../../design-system/cn';

interface TerminalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export function TerminalButton({
  children,
  variant = 'primary',
  loading,
  className,
  disabled,
  ...props
}: TerminalButtonProps) {
  const styles = {
    primary: 'bg-terminal-green/10 border-terminal-green/40 text-terminal-green hover:bg-terminal-green hover:text-terminal-bg btn-glow',
    secondary: 'bg-white/[0.03] border-white/[0.08] text-terminal-dim hover:border-white/[0.16] hover:text-terminal-text',
    danger: 'bg-terminal-red/10 border-terminal-red/40 text-terminal-red hover:bg-terminal-red hover:text-terminal-bg',
  }[variant];

  return (
    <button
      className={cn(
        'border px-5 py-2.5 text-xs font-medium tracking-wider uppercase transition-all duration-200 rounded-glass-sm',
        'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none',
        styles,
        loading && 'animate-pulse',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          <span>PROCESSING</span>
        </span>
      ) : children}
    </button>
  );
}
