import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TerminalButton } from './ui';
import { Shield, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'privatesplit_onboarding_seen';

const STEPS = [
  {
    icon: Shield,
    title: 'Private Expense Splitting',
    desc: 'Split expenses with friends without revealing who owes what, how much, or who paid. Powered by Aleo zero-knowledge proofs.',
    color: 'rgb(52, 211, 153)',
    bg: 'rgba(52, 211, 153, 0.08)',
  },
  {
    icon: Users,
    title: 'Create & Issue Debts',
    desc: 'Create a split, then issue encrypted debt records to each participant. Debt issuance leaves zero trace on-chain.',
    color: 'rgb(34, 211, 238)',
    bg: 'rgba(34, 211, 238, 0.08)',
  },
  {
    icon: Zap,
    title: 'Pay Privately',
    desc: 'Participants pay using credits.aleo/transfer_private. Payer identity is hidden by the Aleo protocol. Both parties get encrypted receipts.',
    color: 'rgb(167, 139, 250)',
    bg: 'rgba(167, 139, 250, 0.08)',
  },
  {
    icon: CheckCircle2,
    title: 'Settle & Verify',
    desc: 'The creator settles the split on-chain. Anyone can verify the split status in the Explorer — but only participants can see the private details.',
    color: 'rgb(251, 191, 36)',
    bg: 'rgba(251, 191, 36, 0.08)',
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-md glass-card glass-card-accent p-6 rounded-glass"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.2 }}
          >
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? 24 : 8,
                      background: i <= step ? current.color : 'rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleClose}
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors tracking-wider"
              >
                SKIP
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: current.bg, border: `1px solid ${current.color}30` }}
                >
                  <current.icon className="w-8 h-8" style={{ color: current.color }} />
                </div>
                <h3 className="text-lg font-bold text-white/90 mb-2">{current.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{current.desc}</p>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              {step > 0 && (
                <TerminalButton
                  variant="secondary"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  BACK
                </TerminalButton>
              )}
              <TerminalButton onClick={handleNext} className="flex-1">
                {step < STEPS.length - 1 ? (
                  <>NEXT <ArrowRight className="w-3.5 h-3.5" /></>
                ) : (
                  <>GET STARTED <Zap className="w-3.5 h-3.5" /></>
                )}
              </TerminalButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
