import { useSupabase } from './_store.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    status: 'ok',
    service: 'privatesplit-api',
    version: '2.0.0',
    network: 'aleo-testnet',
    program: 'private_split_v2.aleo',
    storage: useSupabase ? 'supabase' : 'in-memory',
    wave: 2,
    timestamp: new Date().toISOString(),
  });
}
