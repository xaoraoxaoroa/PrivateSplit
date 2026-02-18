import { cn } from '../../design-system/cn';
import { formatTimestamp } from '../../utils/format';
import type { LogEntry as LogEntryType } from '../../types/split';

interface LogEntryProps {
  entry: LogEntryType;
}

export function LogEntry({ entry }: LogEntryProps) {
  const typeColors = {
    info: 'text-terminal-text',
    success: 'text-terminal-green',
    error: 'text-terminal-red',
    warning: 'text-terminal-amber',
    system: 'text-terminal-cyan',
  };

  return (
    <div className={cn('flex gap-2 text-xs font-mono animate-fade-in', typeColors[entry.type])}>
      <span className="text-terminal-dim shrink-0">[{formatTimestamp(entry.timestamp)}]</span>
      <span>{entry.message}</span>
    </div>
  );
}
