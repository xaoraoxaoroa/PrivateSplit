import { cn } from '../../design-system/cn';

interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TerminalInput({ label, error, className, ...props }: TerminalInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-terminal-dim text-xs tracking-widest uppercase">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 bg-terminal-bg border border-terminal-border focus-within:border-terminal-green transition-colors">
        <span className="text-terminal-green pl-3 select-none">&gt;</span>
        <input
          className={cn(
            'w-full bg-transparent py-2 pr-3 text-sm font-mono text-terminal-text',
            'outline-none placeholder:text-terminal-dim/50',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-terminal-red text-xs">{error}</p>}
    </div>
  );
}
