import { cn } from '../../design-system/cn';

interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TerminalInput({ label, error, className, ...props }: TerminalInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-terminal-dim text-xs tracking-wider uppercase font-medium">
          {label}
        </label>
      )}
      <div className={cn(
        'flex items-center gap-2 bg-white/[0.02] border rounded-glass-sm transition-colors',
        error ? 'border-terminal-red/40' : 'border-white/[0.08] focus-within:border-terminal-green/60',
      )}>
        <span className="text-terminal-green/60 pl-3 select-none font-mono text-sm">&gt;</span>
        <input
          className={cn(
            'w-full bg-transparent py-2.5 pr-3 text-sm font-mono text-terminal-text',
            'outline-none placeholder:text-terminal-dim/40',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-terminal-red text-xs">{error}</p>}
    </div>
  );
}
