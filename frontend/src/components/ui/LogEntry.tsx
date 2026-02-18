import { cn } from '../../design-system/cn';
import { formatTimestamp } from '../../utils/format';
import type { LogEntry as LogEntryType } from '../../types/split';

interface LogEntryProps {
  entry: LogEntryType;
}

export function LogEntry({ entry }: LogEntryProps) {
  const typeConfig = {
    info: { color: 'text-terminal-text', dot: 'bg-terminal-dim' },
    success: { color: 'text-terminal-green', dot: 'bg-terminal-green' },
    error: { color: 'text-terminal-red', dot: 'bg-terminal-red' },
    warning: { color: 'text-terminal-amber', dot: 'bg-terminal-amber' },
    system: { color: 'text-terminal-cyan', dot: 'bg-terminal-cyan' },
  };

  const config = typeConfig[entry.type];

  return (
    <div className={cn('flex items-start gap-2 text-xs font-mono animate-fade-in py-0.5')}>
      <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', config.dot)} />
      <span className="text-terminal-dim shrink-0">{formatTimestamp(entry.timestamp)}</span>
      <span className={config.color}>{entry.message}</span>
    </div>
  );
}
