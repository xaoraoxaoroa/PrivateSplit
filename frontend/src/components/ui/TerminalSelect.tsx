import { cn } from '../../design-system/cn';

interface TerminalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
}

export function TerminalSelect({ label, options, className, ...props }: TerminalSelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-terminal-dim text-xs tracking-widest uppercase">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 bg-terminal-bg border border-terminal-border focus-within:border-terminal-green transition-colors">
        <span className="text-terminal-green pl-3 select-none">&gt;</span>
        <select
          className={cn(
            'w-full bg-transparent py-2 pr-3 text-sm font-mono text-terminal-text',
            'outline-none appearance-none cursor-pointer',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-terminal-bg text-terminal-text">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
