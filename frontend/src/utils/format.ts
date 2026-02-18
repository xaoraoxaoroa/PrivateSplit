import { MICROCREDITS_PER_CREDIT } from './constants';

export function microToCredits(micro: number): string {
  const credits = micro / MICROCREDITS_PER_CREDIT;
  if (credits >= 1) return credits.toFixed(2);
  if (credits >= 0.01) return credits.toFixed(4);
  return credits.toFixed(6);
}

export function creditsToMicro(credits: string): number {
  return Math.floor(parseFloat(credits) * MICROCREDITS_PER_CREDIT);
}

export function truncateAddress(address: string, chars = 6): string {
  if (!address || address.length < chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'active': return 'ACTIVE';
    case 'settled': return 'SETTLED';
    case 'pending': return 'PENDING';
    default: return status.toUpperCase();
  }
}
