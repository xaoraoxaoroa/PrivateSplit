import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { encrypt, decrypt } from './encryption.js';
import 'dotenv/config';

// Validate required environment variables at startup
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('FATAL: Missing required environment variables SUPABASE_URL and/or SUPABASE_KEY');
  console.error('Copy .env.example to .env and fill in your Supabase credentials');
  process.exit(1);
}

if (!process.env.ENCRYPTION_KEY) {
  console.error('FATAL: Missing ENCRYPTION_KEY environment variable');
  console.error('Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

const PORT = process.env.PORT || 3001;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'privatesplit-backend' });
});

// Get all splits (paginated)
app.get('/api/splits', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = supabase
      .from('splits')
      .select('*')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    const decrypted = (data || []).map(decryptSplit);
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get splits by creator
app.get('/api/splits/creator/:address', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('splits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter in-memory since encrypted addresses can't be queried
    const filtered = (data || [])
      .map(decryptSplit)
      .filter((s) => s.creator === req.params.address);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent splits
app.get('/api/splits/recent', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('splits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.json((data || []).map(decryptSplit));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single split
app.get('/api/splits/:splitId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('splits')
      .select('*')
      .eq('split_id', req.params.splitId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });

    res.json(decryptSplit(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create split
app.post('/api/splits', async (req, res) => {
  try {
    const {
      split_id,
      creator,
      total_amount,
      per_person,
      participant_count,
      salt,
      description,
      transaction_id,
      participants,
    } = req.body;

    const record = {
      split_id,
      creator: encrypt(creator),
      total_amount: encrypt(String(total_amount)),   // Encrypt financial data
      per_person: encrypt(String(per_person)),        // Encrypt financial data
      participant_count,
      salt,
      description: description || '',
      status: 'active',
      payment_count: 0,
      transaction_id: transaction_id || '',
      participants: (participants || []).map((addr) => encrypt(addr)),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('splits')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    res.json(decryptSplit(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update split
app.patch('/api/splits/:splitId', async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.payment_count !== undefined) updates.payment_count = req.body.payment_count;
    if (req.body.issued_count !== undefined) updates.issued_count = req.body.issued_count;

    const { data, error } = await supabase
      .from('splits')
      .update(updates)
      .eq('split_id', req.params.splitId)
      .select()
      .single();

    if (error) throw error;
    res.json(decryptSplit(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function decryptSplit(row) {
  if (!row) return row;
  // Helper: try to decrypt, fall back to raw value (handles legacy unencrypted rows)
  const tryDecrypt = (val) => {
    if (!val) return val;
    try { return decrypt(String(val)); } catch { return val; }
  };
  return {
    ...row,
    creator: tryDecrypt(row.creator),
    total_amount: parseInt(tryDecrypt(row.total_amount)) || row.total_amount,
    per_person: parseInt(tryDecrypt(row.per_person)) || row.per_person,
    participants: Array.isArray(row.participants)
      ? row.participants.map((p) => (typeof p === 'string' ? tryDecrypt(p) : p))
      : [],
  };
}

app.listen(PORT, () => {
  console.log(`PrivateSplit backend running on port ${PORT}`);
});
