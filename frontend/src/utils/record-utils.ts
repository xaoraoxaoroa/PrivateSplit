/**
 * Aleo record plaintext parsing utilities.
 *
 * Record plaintext format:
 *   {
 *     owner: aleo1xxx.private,
 *     split_id: 1234field.private,
 *     amount: 500000u64.private,
 *     _nonce: 1234group.public,
 *     _version: 1u8.public
 *   }
 */

/**
 * Extract a named field value from record plaintext.
 * Returns the raw value string (without .private/.public suffix).
 */
export function extractField(plaintext: string, fieldName: string): string | null {
  if (!plaintext) return null;
  const pattern = new RegExp(
    `\\b${fieldName}:\\s*([^\\s,\\n}]+?)(?:\\.(?:private|public))?\\s*[,\\n}]`,
  );
  const match = plaintext.match(pattern);
  if (!match?.[1]) return null;
  return match[1].trim();
}

/**
 * Parse all fields from record plaintext into a key to value map.
 */
export function parseRecordFields(plaintext: string): Record<string, string> {
  if (!plaintext) return {};
  const result: Record<string, string> = {};
  const pattern = /\b(\w+):\s*([^\s,\n}]+?)(?:\.(?:private|public))?\s*[,\n}]/g;
  let match;
  while ((match = pattern.exec(plaintext)) !== null) {
    const [, key, value] = match;
    result[key] = value.trim();
  }
  return result;
}

/** True if a record is a Split record (has participant_count, no creditor). */
export function isSplitRecord(plaintext: string, data?: any): boolean {
  const pc = extractField(plaintext, 'participant_count') || data?.participant_count;
  const cr = extractField(plaintext, 'creditor') || data?.creditor;
  return !!pc && !cr;
}

/** True if a record is a Debt record (has creditor, no participant_count). */
export function isDebtRecord(plaintext: string, data?: any): boolean {
  const cr = extractField(plaintext, 'creditor') || data?.creditor;
  const pc = extractField(plaintext, 'participant_count') || data?.participant_count;
  return !!cr && !pc;
}

/**
 * Check if a record matches the current split context (by salt or split_id).
 * Uses structured field extraction with fallback to substring for resilience.
 */
export function recordMatchesSplitContext(
  plaintext: string,
  data: any,
  salt: string,
  splitId?: string | null,
): boolean {
  const saltInRecord = extractField(plaintext, 'salt') || data?.salt || '';
  const saltNorm = salt.replace(/field$/, '');
  const saltRecordNorm = saltInRecord.replace(/field$/, '');
  const saltMatch =
    saltRecordNorm === saltNorm ||
    (salt.length > 10 && plaintext.includes(saltNorm));

  let splitIdMatch = false;
  if (splitId && splitId !== 'null' && splitId !== 'undefined') {
    const splitIdInRecord = extractField(plaintext, 'split_id') || data?.split_id || '';
    const splitIdNorm = splitId.replace(/field$/, '');
    const splitIdRecordNorm = splitIdInRecord.replace(/field$/, '');
    splitIdMatch =
      splitIdRecordNorm === splitIdNorm ||
      (splitId.length > 20 && plaintext.includes(splitIdNorm));
  }

  return saltMatch || splitIdMatch;
}

/**
 * Extract microcredits value from a credits.aleo record.
 * Handles multiple formats from different wallet adapters.
 */
export function getMicrocreditsFromRecord(record: any): number {
  try {
    if (record.data?.microcredits) {
      return parseInt(String(record.data.microcredits).replace(/u64|_/g, ''));
    }
    if (record.plaintext) {
      const val = extractField(record.plaintext, 'microcredits');
      if (val) return parseInt(val.replace(/u64/g, ''));
    }
    if (record.microcredits) {
      return parseInt(String(record.microcredits).replace(/u64|_/g, ''));
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Build plaintext string for a credits record to use as a transaction input.
 */
export function buildCreditsRecordPlaintext(record: any): string | null {
  if (record.plaintext) return record.plaintext;

  const nonce = record.nonce || record._nonce || record.data?._nonce;
  if (nonce && record.owner) {
    const microcredits = getMicrocreditsFromRecord(record);
    return `{ owner: ${record.owner}.private, microcredits: ${microcredits}u64.private, _nonce: ${nonce}.public }`;
  }

  if (record.ciphertext) return record.ciphertext;
  if (record.recordCiphertext) return record.recordCiphertext;
  return null;
}

/**
 * Reconstruct a record plaintext string from structured wallet data.
 * Shield Wallet often returns records with owner/data/nonce but no plaintext.
 * This builds the plaintext string the wallet adapter expects as transaction input.
 */
function reconstructRecordPlaintext(record: any): string | null {
  const owner = record.owner;
  const nonce = record.nonce || record._nonce || record.data?._nonce;
  const data = record.data;

  if (!owner || !nonce || !data) return null;

  const ownerStr = String(owner).includes('.private') ? owner : `${owner}.private`;
  const nonceStr = String(nonce).includes('.public') ? nonce : `${nonce}.public`;

  let fields = `owner: ${ownerStr},\n`;

  for (const [key, value] of Object.entries(data)) {
    if (key === '_nonce' || key === 'owner') continue;
    const valStr = String(value);
    // If value already has .private/.public suffix, use as-is; otherwise add .private
    const formatted = valStr.includes('.private') || valStr.includes('.public')
      ? valStr
      : `${valStr}.private`;
    fields += `  ${key}: ${formatted},\n`;
  }
  fields += `  _nonce: ${nonceStr}`;

  return `{\n  ${fields}\n}`;
}

/**
 * Extract a usable transaction input from a wallet record object.
 * Follows NullPay's proven fallback chain:
 *   1. r.plaintext (direct string)
 *   2. Decrypt r.recordCiphertext if decrypt function available
 *   3. Reconstruct from r.data + r.owner + r.nonce
 *   4. r.ciphertext
 *   5. r.recordCiphertext (raw)
 *   6. Raw record object (wallet adapter may accept it directly)
 */
export async function getRecordInput(
  record: any,
  decryptFn?: ((ciphertext: string) => Promise<string>) | null,
): Promise<{ input: any; plaintext: string }> {
  // 1. Direct plaintext
  if (record.plaintext) {
    return { input: record.plaintext, plaintext: record.plaintext };
  }

  // 2. Try decrypting recordCiphertext
  if (record.recordCiphertext && decryptFn) {
    try {
      const decrypted = await decryptFn(record.recordCiphertext);
      if (decrypted) {
        return { input: decrypted, plaintext: decrypted };
      }
    } catch { /* continue */ }
  }

  // 3. Reconstruct from data + owner + nonce
  const reconstructed = reconstructRecordPlaintext(record);
  if (reconstructed) {
    return { input: reconstructed, plaintext: reconstructed };
  }

  // 4. Ciphertext string
  if (record.ciphertext) {
    return { input: record.ciphertext, plaintext: '' };
  }

  // 5. recordCiphertext (without decrypt)
  if (record.recordCiphertext) {
    return { input: record.recordCiphertext, plaintext: '' };
  }

  // 6. If record is a string itself
  if (typeof record === 'string') {
    return { input: record, plaintext: record };
  }

  // 7. Last resort: pass raw record object (NullPay does this — wallet adapter may accept it)
  return { input: record, plaintext: '' };
}
