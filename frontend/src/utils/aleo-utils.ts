import { PROGRAM_ID, TESTNET_API, POLL_INTERVAL, POLL_MAX_ATTEMPTS } from './constants';

export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  const bigInt = BigInt('0x' + hex);
  return bigInt.toString() + 'field';
}

export async function getSplitIdFromMapping(salt: string): Promise<string | null> {
  try {
    const url = `${TESTNET_API}/program/${PROGRAM_ID}/mapping/split_salts/${salt}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    return text.replace(/"/g, '').trim() || null;
  } catch {
    return null;
  }
}

export async function getSplitStatus(splitId: string): Promise<{ participant_count: number; payment_count: number; status: number } | null> {
  try {
    const url = `${TESTNET_API}/program/${PROGRAM_ID}/mapping/splits/${splitId}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    // Parse SplitMeta struct: { participant_count: Xu8, payment_count: Xu8, status: Xu8 }
    const pcMatch = text.match(/participant_count:\s*(\d+)u8/);
    const pmMatch = text.match(/payment_count:\s*(\d+)u8/);
    const stMatch = text.match(/status:\s*(\d+)u8/);
    if (!pcMatch || !pmMatch || !stMatch) return null;
    return {
      participant_count: parseInt(pcMatch[1]),
      payment_count: parseInt(pmMatch[1]),
      status: parseInt(stMatch[1]),
    };
  } catch {
    return null;
  }
}

export async function getTransactionStatus(txId: string): Promise<string | null> {
  try {
    const url = `${TESTNET_API}/transaction/${txId}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.status || data?.type || 'confirmed';
  } catch {
    return null;
  }
}

export async function pollTransaction(
  txId: string,
  onStatus?: (msg: string) => void,
): Promise<boolean> {
  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    onStatus?.(`Polling transaction... attempt ${i + 1}/${POLL_MAX_ATTEMPTS}`);
    try {
      const status = await getTransactionStatus(txId);
      if (status) return true;
    } catch {
      // continue polling
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }
  return false;
}

export function formatAleoInput(value: string | number, type: string): string {
  switch (type) {
    case 'u8': return `${value}u8`;
    case 'u64': return `${value}u64`;
    case 'field': return String(value).endsWith('field') ? String(value) : `${value}field`;
    case 'address': return String(value);
    default: return String(value);
  }
}
