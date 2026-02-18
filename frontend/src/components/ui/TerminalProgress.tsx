import { cn } from '../../design-system/cn';
import type { PaymentStep } from '../../types/split';

interface TerminalProgressProps {
  currentStep: PaymentStep;
  className?: string;
}

const STEPS: { key: PaymentStep; label: string }[] = [
  { key: 'connect', label: 'connect' },
  { key: 'verify', label: 'verify' },
  { key: 'convert', label: 'convert' },
  { key: 'pay', label: 'pay' },
  { key: 'success', label: 'done' },
];

export function TerminalProgress({ currentStep, className }: TerminalProgressProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const errorMode = currentStep === 'error';

  return (
    <div className={cn('flex items-center gap-0 text-xs font-mono', className)}>
      {STEPS.map((step, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            {i > 0 && (
              <span className={cn('mx-1', isPast ? 'text-terminal-green' : 'text-terminal-dim')}>
                ---
              </span>
            )}
            <span
              className={cn(
                'tracking-wider',
                isPast && 'text-terminal-green',
                isCurrent && !errorMode && 'text-terminal-amber',
                errorMode && isCurrent && 'text-terminal-red',
                !isPast && !isCurrent && 'text-terminal-dim',
              )}
            >
              [{step.label}]
            </span>
          </div>
        );
      })}
    </div>
  );
}
