-- PrivateSplit Database Schema (Supabase PostgreSQL)
-- Run this in your Supabase SQL Editor to create the required table.

CREATE TABLE IF NOT EXISTS splits (
  id SERIAL PRIMARY KEY,
  split_id VARCHAR(256) UNIQUE NOT NULL,
  creator VARCHAR(512) NOT NULL,          -- AES-256-GCM encrypted Aleo address
  total_amount BIGINT NOT NULL,           -- microcredits
  per_person BIGINT NOT NULL,             -- microcredits
  participant_count SMALLINT NOT NULL DEFAULT 2,
  issued_count SMALLINT NOT NULL DEFAULT 0,
  payment_count SMALLINT NOT NULL DEFAULT 0,
  salt VARCHAR(256) NOT NULL,
  description TEXT DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'active',  -- 'active' | 'settled'
  transaction_id VARCHAR(256) DEFAULT '',
  participants JSONB DEFAULT '[]'::jsonb,         -- Array of encrypted addresses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_splits_status ON splits(status);
CREATE INDEX IF NOT EXISTS idx_splits_created_at ON splits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_splits_salt ON splits(salt);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_splits_updated_at
  BEFORE UPDATE ON splits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE splits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads (for the API)
CREATE POLICY "Allow anonymous reads" ON splits
  FOR SELECT USING (true);

-- Allow anonymous inserts (API creates records)
CREATE POLICY "Allow anonymous inserts" ON splits
  FOR INSERT WITH CHECK (true);

-- Allow anonymous updates (API updates status)
CREATE POLICY "Allow anonymous updates" ON splits
  FOR UPDATE USING (true);
