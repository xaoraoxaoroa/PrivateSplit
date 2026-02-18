# PrivateSplit — Privacy-First Expense Splitting on Aleo

> Split expenses with friends. Nobody sees who owes what. Built on Aleo's zero-knowledge blockchain.

## What is PrivateSplit?

PrivateSplit is the first privacy-preserving expense splitting protocol on Aleo. Think Splitwise, but with cryptographic privacy guarantees: amounts, participants, and payment details are encrypted in Aleo records. Only anonymous counters (how many paid, how many participants) are visible on-chain.

## Privacy Model

| Data | Storage | Visibility |
|------|---------|-----------|
| Split amounts | Records (encrypted) | Only creator |
| Who owes whom | Debt records (encrypted) | Only debtor + creator |
| Payment details | Receipt records (encrypted) | Only payer + creator |
| Payment amounts | Never on-chain in plaintext | Private |
| Participant count | Mapping (public) | Anyone |
| Payment count | Mapping (public) | Anyone |
| Split status | Mapping (public) | Anyone |

**Zero amounts, zero addresses in public mappings.** Only anonymous counters.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (React 18 + Vite + Terminal UI)       │
│  - Shield Wallet integration                    │
│  - Zustand state + localStorage persist         │
│  - Terminal aesthetic (JetBrains Mono)           │
├─────────────────────────────────────────────────┤
│  LEO SMART CONTRACT (private_split_v1.aleo)     │
│  - 4 record types (Split, Debt, receipts)       │
│  - 2 mappings (minimal public metadata)         │
│  - 5 transitions (create, issue, pay, settle)   │
│  - imports credits.aleo for real payments       │
├─────────────────────────────────────────────────┤
│  BACKEND (Node.js + Express + Supabase)         │
│  - AES-256-GCM encrypted storage                │
│  - REST API for split indexing                   │
└─────────────────────────────────────────────────┘
```

## Smart Contract: `private_split_v1.aleo`

### Records (all private)
- **Split** — Creator's record with total amount, per-person share, participant count
- **Debt** — Issued to each participant, contains amount owed and creditor address
- **PayerReceipt** — Proof of payment for the payer
- **CreatorReceipt** — Proof of receipt for the creator

### Transitions
1. `create_split(total, count, salt)` — Create a new expense split
2. `issue_debt(split_record, participant)` — Issue debt to a participant
3. `pay_debt(debt_record, credits_record)` — Pay via `credits.aleo/transfer_private`
4. `settle_split(split_record)` — Creator settles the split
5. `verify_split(split_id)` — Public status query

### Mappings (minimal public data)
- `splits: field => SplitMeta` — Only stores {participant_count, payment_count, status}
- `split_salts: field => field` — Maps salt to split_id for lookup

## How to Test

### Prerequisites
- [Shield Wallet](https://shieldwallet.xyz) browser extension
- Aleo Testnet credits (get from faucet)

### Run Locally
```bash
# Frontend
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173

# Backend
cd backend
cp .env.example .env
# Fill in Supabase credentials
npm install
npm run dev
# API at http://localhost:3001
```

### End-to-End Flow
1. Connect Shield Wallet on `/connect`
2. Create a split on `/create` (description, amount, participants)
3. Share the payment link with participants
4. Participants open link and pay with one click
5. Creator settles when all payments received

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Leo (Aleo) |
| Blockchain | Aleo Testnet |
| Hashing | BHP256 |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Wallet | Shield Wallet (via @provablehq adapters) |
| State | Zustand + localStorage |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Encryption | AES-256-GCM (off-chain) |

## Live Demo

- **Frontend:** [https://frontend-ten-ochre-37.vercel.app](https://frontend-ten-ochre-37.vercel.app)
- **Contract:** `private_split_v1.aleo` on Aleo Testnet
- **Explorer:** [View on Provable Explorer](https://testnet.explorer.provable.com/program/private_split_v1.aleo)

## Wave 2 Progress

- [x] Leo smart contract with 4 record types and 5 transitions
- [x] Terminal-aesthetic frontend with Shield Wallet integration
- [x] Zero private data in public mappings (pure privacy)
- [x] Real `credits.aleo/transfer_private` for payments
- [x] Backend with AES-256-GCM encrypted storage
- [x] Payment link sharing for one-click payments
- [x] On-chain Explorer page (lookup by split_id, salt, or TX hash)
- [x] Receipt Verification page (scan wallet for proof-of-payment records)
- [x] Issue Debt functionality (creator issues on-chain debts to participants)
- [x] 4-strategy split ID retrieval (matching NullPay's proven pattern)
- [x] Wallet adapter transaction status polling
- [x] Immutable deployment with @noupgrade constructor
- [x] Contract test suite (6 test transitions)
- [x] Database schema with RLS policies
- [ ] Deploy contract to testnet
- [ ] Execute test transactions
- [ ] Record video demo

## License

MIT
