# PrivateSplit — The Only Private Expense Splitter on Aleo

> Split expenses with friends without revealing who owes what, how much, or who paid.

**Live Demo:** https://privatesplit.vercel.app
**Contract:** `private_split_v1.aleo` on Aleo Testnet
**Built for:** Aleo Privacy Buildathon by AKINDO — Wave 2
**GitHub:** https://github.com/xaoraoxaoroa/PrivateSplit

---

## The Problem

Splitwise stores every expense, every amount, and every participant on their servers. Venmo publishes your payment activity by default. Every time you split a dinner or a trip with friends, a corporation learns your financial relationships, spending habits, and social graph.

**PrivateSplit eliminates this.** Every amount, every participant, every debt — encrypted on-chain using zero-knowledge proofs. The only public information is an anonymous counter: "a split exists, N people were involved, M have paid."

---

## Why PrivateSplit Has Stronger Privacy Than Any Other Payment App on Aleo

Most ZK payment systems still leak financial data because they use public inputs in transitions. Here is a concrete comparison:

| Data | Splitwise | Venmo | Other ZK Apps | **PrivateSplit** |
|------|-----------|-------|--------------|-----------------|
| Payment amounts on-chain | N/A | N/A | **Public inputs** | **Never stored** |
| Merchant/recipient address | N/A | N/A | **Public inputs** | **Encrypted in record** |
| Who owes whom | Server | Server | N/A | **Zero on-chain trace** |
| Debt issuance event | Server | Server | On-chain | **No finalize — invisible** |
| Payment metadata | Server | Public | **Public field** | **Not supported (by design)** |
| Settlement event | Server | N/A | Hash visible | Anonymous counter only |

### The Nuclear Privacy Advantage: `issue_debt` Has No Finalize

In PrivateSplit, when a creator issues a debt to a participant, **there is literally zero on-chain record that this happened**. The `issue_debt` transition has no `finalize` block. This means:

- No mapping is written
- No hash is stored
- No event is emitted
- The blockchain observer sees nothing

The participant's encrypted Debt record appears in their wallet. That is it. No blockchain explorer can determine who owes what to whom.

This is architecturally impossible with hash-based invoice systems that must register invoices on-chain.

---

## Privacy Model

| Data | Storage | Visible To |
|------|---------|-----------|
| Total split amount | Split record (encrypted) | Creator only |
| Per-person share | Split + Debt records | Creator + debtor only |
| Who owes whom | Debt record (encrypted) | Debtor + creditor only |
| Payment amounts | Receipt records (encrypted) | Payer + creditor only |
| Payer identity | credits.aleo/transfer_private | Hidden by protocol |
| Split exists | `splits` mapping | Public (anonymous) |
| Number of participants | `splits` mapping | Public (just a count) |
| Number of payments | `splits` mapping | Public (just a count) |
| Settlement status | `splits` mapping | Public (0 or 1) |

**Zero amounts in any public mapping. Zero addresses in any public mapping. Zero private data in any finalize block.**

---

## Smart Contract: 5 Transitions, 4 Records, Zero Leaks

```
program private_split_v1.aleo
│
├── Records (ALL private, encrypted to owner)
│   ├── Split         — Creator's record (total, per-person, count)
│   ├── Debt          — Participant's record (amount owed, to whom)
│   ├── PayerReceipt  — Payer's proof of payment
│   └── CreatorReceipt — Creator's proof of receipt
│
├── Mappings (ONLY anonymous counters, zero private data)
│   ├── splits:      split_id → {participant_count, payment_count, status}
│   └── split_salts: salt → split_id  (for post-creation lookup)
│
└── Transitions
    ├── create_split(total, count, salt)         → Split + finalize (stores counters)
    ├── issue_debt(split_record, participant)     → Split + Debt    (NO FINALIZE)
    ├── pay_debt(debt_record, credits_record)     → receipts + finalize (increments counter)
    ├── settle_split(split_record)               → finalize (sets status=1)
    └── verify_split(split_id)                   → finalize (public read)
```

### Key Design: Only the Record Owner Can Spend It

Aleo's protocol enforces record ownership at the ZK proof level — not application logic. This means:
- Only the creator can issue debts (they own the Split record)
- Only the participant can pay their debt (they own the Debt record)
- Nobody can forge a receipt — ownership is cryptographically verified

---

## User Flow

```
Creator                              Participant
   │                                     │
   ├─ create_split(amount, 3, salt)       │
   │    → Split record (private)         │
   │    → splits mapping (counters only) │
   │                                     │
   ├─ issue_debt(split, alice)            │
   │    → Updated Split record           │
   │    → Debt record ──────────────────►│
   │       (NO ON-CHAIN TRACE)           │
   │                                     │
   │  Share payment link / QR code       │
   │  ──────────────────────────────────►│
   │                                     ├─ pay_debt(debt, credits)
   │                                     │    → transfer_private(to creator)
   │◄── CreatorReceipt (proof received)  │    → PayerReceipt (proof paid)
   │                                     │    → payment_count + 1 (on-chain)
   │                                     │
   ├─ settle_split(split_record)          │
   │    → status = 1 (settled)            │
```

---

## Wave 2 Progress Changelog

### New in Wave 2 (Feb 11–25, 2026)

**Smart Contract**
- Deployed `private_split_v1.aleo` on Aleo Testnet
- `issue_debt` transition with NO finalize block — zero on-chain trace
- 4 record types with zero amounts in public mappings
- Cryptographic settlement: only record owner can settle (protocol-enforced)
- Confirmed on-chain TX: `at1ue3v4t5u9rsmf7h7jnee8dhr6dguda59lrct68j3d4rjhm395vqqhjwcxv`

**Shield Wallet Integration (Wave 2 Mandatory)**
- Full Shield Wallet support via `@provablehq/aleo-wallet-adaptor-react`
- Real `credits.aleo/transfer_private` payments (not mocked)
- 4-strategy split_id retrieval after transaction finalization
- Robust record matching using structured field parsing

**Privacy Architecture**
- Cryptographically secure salt via `crypto.getRandomValues()` (not `Math.random()`)
- Backend encrypts all sensitive fields (addresses + amounts) with AES-256-GCM
- COOP/COEP headers for WASM isolation (required for Aleo SDK)
- Zero private data in any finalize scope

**Frontend — Glassmorphic Design System (Wave 2 Overhaul)**
- Full UI redesign: glassmorphic dark fintech aesthetic with Inter + JetBrains Mono typography
- Glassmorphic cards: subtle transparency, border-radius, backdrop blur, soft glows
- Modern color palette: emerald green (#34d399), cyan (#22d3ee), purple (#a78bfa), amber (#fbbf24)
- 9 functional pages: Dashboard, Create, Pay, Split Detail, History, Explorer, Verification, Privacy, Connect
- Status badges with animated pulse indicators (active/settled/pending)
- Progress bars on split cards and explorer results
- QR code generation for payment link sharing
- Ambient background gradients and staggered page animations
- On-chain explorer with split ID, salt, and TX hash lookup
- Receipt verification: scan wallet for PayerReceipt/CreatorReceipt, cross-check on-chain
- Privacy comparison table (vs Splitwise, Venmo, other ZK apps)
- Complete data flow diagram showing the full lifecycle
- Responsive mobile layout with slide-out navigation

**Backend**
- Node.js + Express + Supabase
- AES-256-GCM encrypted storage for all sensitive fields
- REST API for cross-device split recovery

---

## How to Test (Wave 2)

### Prerequisites
- [Shield Wallet](https://www.leo.app/) browser extension installed
- Aleo Testnet credits (get from [faucet](https://faucet.aleo.org/))

### Step-by-Step

1. **Connect**: Visit https://privatesplit.vercel.app → Connect Shield Wallet
2. **Create**: Go to Create → Enter description, total amount, participant count + addresses
3. **Issue Debts**: On the split detail page → click "ISSUE" for each participant
4. **Share**: Copy the payment link or scan the QR code
5. **Pay**: Participants follow the payment link → click "EXECUTE PAYMENT"
6. **Verify**: Visit Explorer → paste split ID → see on-chain status (or use Verification page)
7. **Settle**: Creator clicks "SETTLE SPLIT" when all payments received

### Pre-Populated Test Data

The Explorer page includes quick-lookup buttons with confirmed on-chain data:
- **Split ID**: `1904758949858929157912240259749859140762221531679669196161601694830550064831field`
- **Salt**: `987654321098765field`
- **TX Hash**: `at1ue3v4t5u9rsmf7h7jnee8dhr6dguda59lrct68j3d4rjhm395vqqhjwcxv`

### Test with CLI (Advanced)

```bash
# Verify split on-chain
curl https://api.provable.com/v2/testnet/program/private_split_v1.aleo/mapping/splits/{split_id}

# View program on explorer
# https://testnet.explorer.provable.com/program/private_split_v1.aleo
```

---

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│  FRONTEND  (React 18 + TypeScript + Vite + Tailwind)      │
│  Live: privatesplit.vercel.app                             │
│  Shield Wallet via @provablehq/aleo-wallet-adaptor-react   │
│  Glassmorphic UI: Inter + JetBrains Mono, dark theme       │
├───────────────────────────────────────────────────────────┤
│  LEO SMART CONTRACT  (private_split_v1.aleo)              │
│  Aleo Testnet — 5 transitions, 4 records, 2 mappings      │
│  Zero amounts in mappings · Zero private data in finalize  │
│  issue_debt: NO finalize (100% private operation)          │
├───────────────────────────────────────────────────────────┤
│  BACKEND  (Node.js + Express + Supabase)                  │
│  AES-256-GCM encrypted: addresses + amounts               │
│  REST API for cross-device split recovery                 │
└───────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Leo (Aleo) |
| Blockchain | Aleo Testnet |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (glassmorphic dark theme) |
| Typography | Inter (UI) + JetBrains Mono (data) |
| State | Zustand + localStorage |
| Wallet | Shield Wallet (primary), Leo, Puzzle, Fox, Soter |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Encryption | AES-256-GCM |
| Deployment | Vercel |

---

## Security

- Record ownership enforced by Aleo protocol at ZK proof level
- Nullifiers prevent double-spending (automatic, no manual implementation)
- No private data in any finalize block (verified — only anonymous counters)
- Cryptographically secure random salt: `crypto.getRandomValues(new Uint8Array(16))`
- AES-256-GCM with random IVs for all off-chain encrypted data
- COOP/COEP headers prevent cross-origin data leaks

---

## What's Next (Wave 3+)

- USDCx stablecoin support (dual payment method: credits + USDCx)
- Multi-token payment options
- Group expense templates (recurring splits)
- Treasury management for organizations
- Mobile app (React Native / Expo)
- Full on-chain transaction history viewer
- Enhanced receipt export and dispute resolution

---

## License

MIT
