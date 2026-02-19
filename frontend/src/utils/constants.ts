export const PROGRAM_ID = 'private_split_v2.aleo';
export const PROGRAM_ID_V1 = 'private_split_v1.aleo';
export const CREDITS_PROGRAM = 'credits.aleo';
export const TOKEN_REGISTRY_PROGRAM = 'token_registry.aleo';
export const ALEO_API = 'https://api.provable.com/v2';
export const TESTNET_API = 'https://api.provable.com/v2/testnet';
export const EXPLORER_URL = 'https://testnet.explorer.provable.com';
export const MICROCREDITS_PER_CREDIT = 1_000_000;
export const MAX_PARTICIPANTS = 8;
export const MIN_PARTICIPANTS = 2;
export const POLL_INTERVAL = 1000;
export const POLL_MAX_ATTEMPTS = 120;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
export const DEFAULT_FEE = 100_000; // microcredits

// Expiry options (hours)
// NOTE: Non-zero expiry is disabled — v2 contract stores relative block count
// instead of absolute block height, causing immediate expiry. Needs v3 fix.
export const EXPIRY_OPTIONS = [
  { value: 0, label: 'No Expiry' },
];

// Blocks per hour on Aleo Testnet (~10s block time)
export const BLOCKS_PER_HOUR = 360;
