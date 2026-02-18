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
  return null;
}
