# CLAUDE.md - QuietPay Project Instructions

## Identity

**Project:** QuietPay (PrivateSplit - Private Expense Splitting)
**Domain:** Privacy-first expense splitting protocol on Aleo blockchain
**Competition:** Aleo Privacy Buildathon by AKINDO (10 waves, $50K USDT total)
**Origin:** Fresh project. NullPay (by someone else) won Wave 1 — we studied it as a reference for what judges reward, NOT our codebase.
**NullPay Reference (NOT ours):** https://github.com/geekofdhruv/NullPay
**NullPay Live (NOT ours):** https://null-pay.vercel.app/
**NullPay Contract (reference only):** `zk_pay_proofs_privacy_v7.aleo` (Testnet)

---

## ABSOLUTE RULES

### 1. NEVER GUESS. NEVER ASSUME. ALWAYS VERIFY.

Before writing ANY Aleo/Leo code, SDK call, or architectural decision:

1. **Check the local reference projects FIRST** - `C:\Users\prate\quiet pay\aleo-reference-projects\`
2. **Check the NullPay audit clone** - `C:\Users\prate\NullPay-audit\` (the Wave 1 winning codebase)
3. **Check official docs** if local files don't answer the question:
   - Leo language: https://docs.leo-lang.org/leo
   - Aleo developer docs: https://developer.aleo.org/
4. **Never fabricate API methods, SDK functions, Leo syntax, or program addresses**
5. **Never assume a feature exists in Leo** - verify against the compiler source in `aleo-reference-projects/leo/`

If you cannot find verification for something, say "I need to verify this" and search for it. Do NOT proceed with unverified code.

### 2. NO TIME LIMITS. NO SCOPE FEAR.

- What others estimate takes 30 days, we do in 1 day
- Never say "this would take too long" or "this is too complex for now"
- Never water down ambition. Build the full vision.
- If a feature seems massive, break it into executable steps and start immediately
- The only limit is correctness, never time

### 3. NEVER COMPROMISE ON GOALS

- If the buildathon requires something, it gets built. Period.
- If a judge criterion demands it, we implement it fully
- Never settle for "good enough" when "excellent" is achievable
- Never cut privacy features to save effort - privacy is 40% of the score
- Never mock functionality - judges check every button, every transaction

### 4. THINK AUTONOMOUSLY

- Do not wait for explicit instructions on every micro-decision
- If something obviously needs to be done (tests, deployment, docs), do it
- If you see a security issue, fix it immediately
- If you see a UX problem, flag it and propose a solution
- If a dependency is missing, find the right one from reference projects
- Make architectural decisions based on what the judges want (see judging criteria below)

### 5. BE PRACTICAL AND SUGGEST THINGS

- Proactively suggest improvements, features, and architectural changes
- If you see a better way to implement something, say so
- If a feature would boost our score in a specific judging category, recommend it
- Think like a product builder, not just a code generator
- Consider what makes us stand out among 146+ competing projects

---

## Aleo Reference Projects (LOCAL - USE THESE FIRST)

**Root:** `C:\Users\prate\quiet pay\aleo-reference-projects\`

### 1. `awesome-aleo/` (from https://github.com/howardwu/awesome-aleo)
- Curated list of ALL Aleo ecosystem projects, tools, wallets, DeFi apps
- Use to discover existing patterns, avoid reinventing wheels
- Lists wallet SDKs, explorers, development tools, security resources

### 2. `leo/` (from https://github.com/ProvableHQ/leo)
- **The Leo compiler source code itself**
- `leo/.circleci/lottery/src/main.leo` - Official lottery example
- `leo/.circleci/tictactoe/src/main.leo` - Official tictactoe example
- `leo/.circleci/token/src/main.leo` - Official token example (CRITICAL REFERENCE)
- `leo/leo-fmt/tests/source/*.leo` - Many Leo syntax examples covering every language feature
- `leo/compiler/` - AST, parser, passes - understand what Leo actually supports
- `leo/errors/ERROR_INDEX.md` - All possible Leo compiler errors
- Use this to verify ANY Leo syntax question before writing code

### 3. `welcome/` (from https://github.com/AleoNet/welcome)
- **Official Aleo documentation source**
- `welcome/documentation/concepts/fundamentals/` - Core concepts:
  - `00_accounts.md` - Account keys (private key, view key, compute key, address)
  - `01_programs.md` - Program structure
  - `02_records.md` - **CRITICAL** Record model (UTXO-like, owner-spendable only, encrypted)
  - `03_transactions.md` - Transaction structure
  - `04_transitions.md` - Transition functions (where records are consumed/created)
  - `05_blocks.md` - Block structure
  - `06_public_private.md` - **CRITICAL** Public (mappings) vs Private (records) state
  - `07_async.md` - Async transitions and finalize
  - `08_credits.md` - credits.aleo native token
- `welcome/documentation/concepts/advanced/` - ZK proofs, account keys, R1CS, inclusion proofs
- `welcome/documentation/concepts/network/` - snarkOS, snarkVM, validators, consensus
- `welcome/documentation/sdk/` - **CRITICAL** SDK documentation:
  - `guides/` - Getting started, accounts, deploy, execute, transfer credits, state management
  - `api-specification/` - Account, NetworkClient, ProgramManager, RecordProvider, KeyProvider
  - `wasm/` - All WASM module docs (Address, Transaction, Record, ProofKey, etc.)
  - `create-leo-app/` - App scaffolding
  - `delegate-proving/` - Delegated proof generation
- `welcome/documentation/guides/` - Installation, quick start, Solidity migration, standards
  - `standards/00_token_registry.md` - ARC-20/21 token standard
  - `standards/01_nft_standards.md` - NFT standards
  - `solidity-to-leo/` - Migration guide from Solidity

### 4. `INFO_DATA.md` - Buildathon master document
- Full buildathon rules, wave structure, prize pool
- **Complete judge feedback analysis from 146 Wave 1 submissions**
- Every pattern judges love and hate
- Technical mistakes to avoid
- Scoring criteria with weights

---

## NullPay Architecture (Wave 1 Winner - REFERENCE ONLY, NOT OUR PROJECT)

**Local clone (for study):** `C:\Users\prate\NullPay-audit\`

### Smart Contract: `zk_pay_proofs_privacy_v7.aleo` (latest: v11)
- **Language:** Leo
- **Imports:** `credits.aleo`, `test_usdcx_stablecoin.aleo`
- **Core structures:**
  - `InvoiceData` (struct) - expiry, status, invoice_type, token_type
  - `Invoice` (record) - private to merchant, contains hash, amount, salt
  - `PayerReceipt` (record) - private to payer, proof of payment
  - `MerchantReceipt` (record) - private to merchant, proof of receipt
- **Transitions:**
  - `create_invoice()` - Merchant creates invoice, hash stored on-chain
  - `create_invoice_usdcx()` - Same but for USDCx stablecoin
  - `pay_invoice()` - Payer pays via `credits.aleo/transfer_private`
  - `pay_invoice_usdcx()` - Payer pays via USDCx private transfer
  - `pay_donation()` / `pay_donation_usdcx()` - Open-amount donations
  - `settle_invoice()` - Merchant closes invoice
  - `get_invoice_status()` - Check invoice state
- **Privacy model:**
  - Merchant address + amount hashed with BHP256 (never stored in plaintext on-chain)
  - All payments via `transfer_private` (payer identity hidden)
  - Receipt records are private to their respective owners
  - Salt provides invoice uniqueness and prevents hash collision
- **Mappings (public):**
  - `invoices: field => InvoiceData` - Only stores status/expiry/type (no amounts/addresses)
  - `salt_to_invoice: field => field` - Links salt to invoice hash

### Frontend: React 18 + TypeScript + Vite
- `frontend/src/` - Main source
- Wallet integration via `@provablehq/aleo-wallet-adaptor-react`
- Desktop + Mobile responsive layouts
- Glassmorphism UI with Framer Motion animations
- Pages: CreateInvoice, PaymentPage, Explorer, Verification, Privacy, Vision, Docs
- Hooks: `useCreateInvoice`, `usePayment`, `useTransactions`

### Backend: Node.js + Express + Supabase
- `backend/` - REST API for invoice indexing
- AES-256-GCM encrypted storage for off-chain metadata
- Supabase (PostgreSQL) for fast lookups

### Mobile App: React Native (Expo)
- `app/` - Mobile app source
- Screens: CreateInvoice, PayInvoice, Profile

### Future Roadmap (from docs/future_wave.md):
1. Treasury management
2. Sensitive info stored as records (not mappings)
3. Full SDK integration
4. Expiry enforcement
5. Multi-payment invoices (DONE in v7)
6. Invoice categorization
7. Mobile app completion
8. Enterprise usability

---

## Judging Criteria (MEMORIZE THIS)

| Category | Weight | What Judges Want |
|----------|--------|-----------------|
| **Privacy Usage** | **40%** | Records for private state. No leaks in finalize. No private data in mappings. No reinventing what Aleo gives free. |
| **Technical Implementation** | **20%** | Frontend connected to REAL deployed programs. On-chain transaction history. Proper record ownership. Real token integration (credits.aleo, USDCx). Shield Wallet integration. |
| **User Experience** | **20%** | Clean functional frontend. Pre-populated test data. Working wallet connection. Video demo. |
| **Practicality** | **10%** | Clear WHY for privacy. Trust model explained. Economically sensible. Focused scope. |
| **Novelty/Creativity** | **10%** | Unique use case. Creative approach. Not the 15th prediction market. |

### Critical Anti-Patterns (Instant Score Killers)
- Leaking private data in finalize scope
- Storing private data in public mappings
- Sending records to program addresses (permanently lost)
- Modifying/creating records in finalize scope (impossible)
- Only owner can spend their record - can't pass someone else's record
- Reimplementing what Aleo provides natively (nullifiers, encryption, ZK verification)
- Using ProgramManager.run() with raw Leo code
- Mocking functionality instead of real on-chain interactions
- No live demo or no README

### What Gets Top Scores
- Working frontend connected to real deployed programs (even if buggy)
- Leo code that uses records properly for private state
- On-chain transaction history showing real usage
- Clean professional UI/UX
- Privacy genuinely adding value to the use case
- Clear documentation of what works and what's WIP
- Shield Wallet integration
- Real token integration (credits.aleo or USDCx/USAD)
- Honest about progress

---

## Wave Structure & Deadlines

| Wave | Duration | Prize |
|------|----------|-------|
| Wave 1 | 1/20 - 2/11/26 | $5,000 (WON) |
| Wave 2 | 2/11 - 2/25/26 | $5,000 |
| Wave 3 | 2/25 - 3/11/26 | $5,000 |
| Wave 4 | 3/11 - 3/25/26 | $5,000 |
| Wave 5 | 3/25 - 4/8/26 | $5,000 |
| Wave 6 | 4/8 - 4/22/26 | $5,000 |
| Wave 7 | 4/22 - 5/6/26 | $5,000 |
| Wave 8 | 5/6 - 5/20/26 | $5,000 |
| Wave 9 | 5/20 - 6/3/26 | $5,000 |
| Wave 10 | 6/3 - 6/17/26 | $5,000 |

Each wave: 10-day build phase + 4-day evaluation phase.

### Wave 2+ Mandatory Rules (NEW)
1. Shield Wallet integration required (Leo Wallet rebranded)
2. Must use credits.aleo or USDCx/USAD for payments
3. Must provide progress changelog showing improvements since last wave
4. Descriptive update on Akindo platform
5. No AI slop (depth and intention required, AI tools OK for acceleration)

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Smart Contracts | Leo (Aleo) | Compile to AVM bytecode |
| Blockchain | Aleo Testnet/Mainnet | Privacy L1 with ZK proofs |
| Hashing | BHP256 | ZK-optimized, native to Aleo |
| Frontend | React 18 + TypeScript + Vite | Desktop + Mobile responsive |
| Styling | Tailwind CSS + Framer Motion | Glassmorphism design |
| Wallet | @provablehq/aleo-wallet-adaptor-react | Shield Wallet priority |
| Backend | Node.js + Express | REST API indexer |
| Database | Supabase (PostgreSQL) | Encrypted off-chain storage |
| Encryption | AES-256-GCM | Off-chain metadata |
| SDK | @provablehq/sdk | Aleo TypeScript SDK |
| Mobile | React Native (Expo) | Cross-platform |
| Deploy | Vercel (frontend) | Must be live and accessible |

---

## Tool Usage Policy

### Use Everything Available. Automatically.

- **All MCP servers** - GitHub, HuggingFace, Sentry, etc. Use them for research, verification, deployment
- **All plugins** - code-review, feature-dev, frontend-design, commit-commands, etc.
- **All agents** - code-reviewer, code-architect, code-explorer, silent-failure-hunter, etc.
- **All skills** - frontend-design for UI, commit for git, deploy for Vercel, etc.
- **LSP** - TypeScript LSP for frontend code intelligence
- **Hooks** - Security guidance active on all edits
- **Parallel execution** - Launch multiple agents/tools simultaneously whenever possible

### Research Protocol
For ANY Aleo question:
1. Search `aleo-reference-projects/welcome/documentation/` first
2. Search `aleo-reference-projects/leo/` for compiler/language specifics
3. Search `aleo-reference-projects/awesome-aleo/` for ecosystem tools
4. Check `NullPay-audit/` for how we already solved similar problems
5. Only then check online docs (developer.aleo.org, docs.leo-lang.org)
6. Never proceed with unverified information

---

## Leo Language Quick Reference (from local sources)

### Key Constraints (MUST KNOW)
- Max program size: 100 KB
- Max mappings: 31
- Max imports: 64
- Max functions: 31
- Max structs: 310
- Max records: 310
- Max transaction size: 128 KB
- Max finalize fee: 100,000,000 microcredits
- Records CANNOT be created or modified in finalize scope
- Only the owner of a record can spend it
- Records sent to a program address are PERMANENTLY LOST
- All branches of conditional code execute in transitions (ternary selection)
- Finalize scope values are PUBLIC - never put private data there

### Record Model (UTXO-like)
```
record Token {
    owner: address,      // Who can spend this
    amount: u64,         // Private by default
    _nonce: group,       // Auto-generated
}
```
- Records are consumed and recreated on each transition
- Only owner can spend (enforced by protocol)
- Encrypted on-chain by default
- Nullifiers, inclusion proofs handled automatically by Aleo

### Privacy Pattern
```
// CORRECT: Private data in records, only status in mappings
transition pay(record: credits, recipient: address, amount: u64) -> (credits, credits) {
    // Private computation here
    return credits.aleo/transfer_private(record, recipient, amount);
}

// WRONG: Never put private data in finalize/mappings
async function finalize_pay(secret_amount: u64) {
    // This is PUBLIC! Everyone can see it!
    amounts.set(key, secret_amount); // PRIVACY LEAK
}
```

---

## Submission Checklist (Every Wave)

- [ ] Live web URL (Vercel/Netlify) that loads and works
- [ ] README.md with: description, privacy model, how to test, architecture
- [ ] Leo programs deployed on Aleo Testnet (at minimum)
- [ ] Real on-chain transactions visible on explorer
- [ ] Frontend buttons connected to real on-chain transitions
- [ ] Shield Wallet connection working
- [ ] Video demo showing end-to-end flow
- [ ] Progress changelog (Wave 2+)
- [ ] Akindo platform update with description of work done
- [ ] No private data leaked in finalize scope
- [ ] No sensitive data in public mappings
- [ ] Real token integration (credits.aleo or USDCx/USAD)
