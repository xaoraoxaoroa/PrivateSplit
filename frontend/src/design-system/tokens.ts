export const colors = {
  bg: '#06060a',
  surface: '#0d0d14',
  border: 'rgba(255, 255, 255, 0.08)',
  borderFocus: '#34d399',
  text: '#e8e8f0',
  dim: '#6b6b80',
  green: '#34d399',
  amber: '#fbbf24',
  cyan: '#22d3ee',
  red: '#f87171',
  purple: '#a78bfa',
  blue: '#60a5fa',
} as const;

export const STATUS_SYMBOLS = {
  active: '\u25CF',     // ●
  pending: '\u25CB',    // ○
  partial: '\u25D0',    // ◐
  success: '\u2713',    // ✓
  error: '\u2717',      // ✗
  arrow: '\u2192',      // →
  separator: '\u2502',  // │
  prompt: '>',
  shield: '\u26E8',     // ⛨
  lock: '\u26BF',       // ⚿
} as const;
