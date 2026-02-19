# PrivateSplit — Progress Changelog

## Wave 2 (Feb 11 – Feb 25, 2026)

### New: Smart Contract v2 (`private_split_v2.aleo`)
- Upgraded from `private_split_v1.aleo` to `private_split_v2.aleo`
- Added `expiry_height` field to Split record for future expiry enforcement
- `create_split` now accepts 4 inputs (added `expiry_hours: u32`)
- Both v1 and v2 deployed on Aleo Testnet; frontend uses v2 by default

### End-to-End Payment Flow (Fully Working On-Chain)
- **Create Split** → on-chain transaction creates Split record with ZK proof
- **Issue Debt** → creator issues private Debt records to each participant
- **Pay Debt** → participant pays using `credits.aleo/transfer_private`
- **Settle Split** → creator can close the split on-chain
- All transitions confirmed on-chain with real ZK proofs (not mocked)
- Confirmed transactions visible on [Aleo Explorer](https://testnet.explorer.provable.com)

### Shield Wallet Integration (Wave 2 Mandatory)
- Full Shield Wallet support via `@provablehq/aleo-wallet-adaptor-react`
- Robust record extraction: handles opaque/encrypted wallet records via multi-strategy extraction:
  1. Direct plaintext
  2. Decrypt `recordCiphertext`
  3. Reconstruct from `data` + `owner` + `nonce`
  4. Ciphertext passthrough
  5. Raw record object fallback
- Auto `transfer_public_to_private` when payer lacks private credits
- `wallet.adapter.transactionStatus()` polling for reliable TX confirmation
- v2-first program lookup with v1 fallback for backward compatibility
- 4-strategy split_id retrieval: TX output → mapping lookup → wallet history → public chain API

### Privacy Architecture (40% of judging score)
| Data | Where | Visibility |
|------|-------|-----------|
| Split amounts | Records | Only creator |
| Who owes whom | Debt records | Only debtor |
| Payment amounts | Receipt records | Only payer + creator |
| Participant addresses | Records | Only relevant parties |
| Participant count | Mapping | Public (anonymous counter) |
| Payment count | Mapping | Public (anonymous counter) |
| Split status | Mapping | Public (0=active, 1=settled) |

**Key advantage:** `issue_debt` has NO finalize block — zero on-chain trace of debt issuance.

### Frontend — Complete UI (React 18 + TypeScript + Vite)
- **Glassmorphic design system:** Dark fintech aesthetic with transparent cards, backdrop blur
- **Dual typography:** Inter for UI + JetBrains Mono for data
- **9 functional pages:** Dashboard, Create Split, Pay Split, Split Detail, My Splits, History, Explorer, Verification, Privacy
- **QR code generation:** Payment links shareable via QR code
- **Category system:** 8 expense categories (Dinner, Travel, Rent, etc.) with icons
- **Activity charts:** 10-day activity chart + category breakdown on My Splits
- **Real-time TX log:** Live transaction polling status in sidebar
- **Error boundaries, toast notifications, skeleton loading states**
- **Staggered animations via Framer Motion**

### Backend (Vercel Serverless + Supabase)
- Serverless API functions at `/api/` directory
- Supabase (PostgreSQL) for split indexing with in-memory fallback
- REST endpoints: Create, read, update splits; stats; receipts
- CORS headers and proper error handling
- Graceful Supabase error recovery (falls back to in-memory)

### Bug Fixes (Wave 2)
- Fixed record extraction from Shield Wallet (opaque records with empty plaintext)
- Fixed v2 preference — no longer accidentally uses v1 Split records for v2 splits
- Fixed payer Debt record lookup with candidate fallback
- Fixed credits record detection after public-to-private conversion
- Fixed TX ID display — only shows real `at1...` chain IDs, not wallet UUIDs
- Fixed AbortController leak in Dashboard useEffect
- Fixed exponential backoff for wallet sync retries
- Disabled expiry options (v2 contract has relative vs absolute block height bug)

### Confirmed On-Chain Transactions
- `create_split` on v2: Block 14,549,xxx
- `issue_debt` on v2: Block 14,549,308 (`at13hjyjrhutkdkf6juvsnwm4rd96vhfgt2nhvr7ayrwk725puru58s5qp5g0`)
- `pay_debt` on v2: Block 14,550,013 (`at1rc4uj8ju4tzjxd6am2dszk8xqzyy6n6cn90n9c34ff4z4qnewgrskhcjjs`)

### Technical Stats
- 45+ source files
- 0 TypeScript errors
- ~970KB JS bundle (~298KB gzip)
- 9 pages, 8 custom hooks, 7 UI components
- Build time: ~6s

---

## Wave 1 (Jan 20 – Feb 11, 2026)

### Initial Release
- Smart contract `private_split_v1.aleo` deployed on Aleo Testnet
- 4 private record types: Split, Debt, PayerReceipt, CreatorReceipt
- 5 transitions: create_split, issue_debt, pay_debt, settle_split, verify_split
- 2 mappings (minimal public state): splits, split_salts
- Frontend with glassmorphic design, 9 pages
- Shield Wallet integration with 5 wallet adapters
- QR code payment links
- Category-based expense organization
