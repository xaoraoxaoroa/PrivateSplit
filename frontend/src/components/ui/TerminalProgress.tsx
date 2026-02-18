import { cn } from '../../design-system/cn';
import type { PaymentStep } from '../../types/split';

interface TerminalProgressProps {
  currentStep: PaymentStep;
  className?: string;
}

const STEPS: { key: PaymentStep; label: string }[] = [
  { key: 'connect', label: 'Connect' },
  { key: 'verify', label: 'Verify' },
  { key: 'convert', label: 'Convert' },
  { key: 'pay', label: 'Pay' },
  { key: 'success', label: 'Done' },
];

export function TerminalProgress({ currentStep, className }: TerminalProgressProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const errorMode = currentStep === 'error';

  return (
    <div className={cn('flex items-center gap-0', className)}>
      {STEPS.map((step, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            {i > 0 && (
              <div className={cn(
                'w-8 h-[2px] mx-1 rounded-full transition-colors',
                isPast ? 'bg-terminal-green' : 'bg-white/[0.08]',
              )} />
            )}
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium border transition-colors',
                isPast && 'bg-terminal-green/20 border-terminal-green text-terminal-green',
                isCurrent && !errorMode && 'bg-terminal-amber/20 border-terminal-amber text-terminal-amber',
                errorMode && isCurrent && 'bg-terminal-red/20 border-terminal-red text-terminal-red',
                !isPast && !isCurrent && 'bg-white/[0.02] border-white/[0.08] text-terminal-dim',
              )}>
                {isPast ? '\u2713' : i + 1}
              </div>
              <span className={cn(
                'text-[10px] tracking-wider hidden sm:inline',
                isPast && 'text-terminal-green',
                isCurrent && !errorMode && 'text-terminal-amber',
                errorMode && isCurrent && 'text-terminal-red',
                !isPast && !isCurrent && 'text-terminal-dim',
              )}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
