# PrivateSplit — Wave 2 Progress Changelog

## Wave 2 (Feb 11 – Feb 25, 2026)

### Smart Contract: `private_split_v1.aleo`
- **4 private record types:** Split, Debt, PayerReceipt, CreatorReceipt — all amounts and addresses encrypted
- **5 transitions:** create_split, issue_debt, pay_debt, settle_split, verify_split
- **2 mappings (minimal):** splits (anonymous counters only), split_salts (lookup)
- **Zero private data in public state:** No amounts, no addresses in mappings — only participant_count, payment_count, status
- **Real payments:** imports `credits.aleo` and uses `transfer_private` for actual credit transfers
- **Immutable deployment:** `@noupgrade` constructor prevents unauthorized program upgrades
- **Multi-party debt issuance:** Creator issues individual Debt records to each participant
- **Dual receipts:** Both payer and creditor get private proof-of-payment records
- **Test suite:** 6 test transitions covering hash determinism, division, bounds, uniqueness

### Frontend (React 18 + TypeScript + Vite)
- **Terminal UI aesthetic:** JetBrains Mono font, #0a0a0a background, #00ff88 green accent, sharp borders (zero border-radius)
- **Shield Wallet integration:** Full connection, record requests, transaction execution, status polling
- **7 pages:** Dashboard, Create Split, Pay Split, Split Detail, History, Explorer, Verification
- **8 custom hooks:** useCreateSplit, usePaySplit, useSettleSplit, useIssueDebt, useSplitStatus, plus WalletProvider
- **4-strategy split ID retrieval:** Transaction output → mapping lookup → wallet history → public chain API
- **Record handling:** Decrypt, extract microcredits, reconstruct plaintext, find sufficient balance
- **Wallet adapter polling:** Uses `wallet.adapter.transactionStatus()` for reliable confirmation
- **Payment links:** One-click pay via URL with creator, amount, salt parameters
- **On-chain explorer:** Look up splits by ID, salt, or transaction hash
- **Receipt verification:** Scan wallet for PayerReceipt/CreatorReceipt records, cross-check on-chain
- **Zustand state** with localStorage persistence
- **No framer-motion:** CSS-only transitions (smaller bundle, faster loads)

### Backend (Node.js + Express + Supabase)
- **AES-256-GCM encryption** for off-chain address storage
- **Fail-fast validation:** Server refuses to start without required environment variables
- **Encryption key validation:** Exactly 32 bytes (64 hex chars), no random fallback
- **PostgreSQL schema** with indexes, RLS policies, auto-updated timestamps
- **REST API:** Create, read, update splits with encrypted participant addresses

### Privacy Model (40% of judging score)
| Data | Where | Visibility |
|------|-------|-----------|
| Split amounts | Records | Only creator |
| Who owes whom | Debt records | Only debtor |
| Payment amounts | Receipt records | Only payer + creator |
| Participant addresses | Records | Only relevant parties |
| Participant count | Mapping | Public (anonymous counter) |
| Payment count | Mapping | Public (anonymous counter) |
| Split status | Mapping | Public (0=active, 1=settled) |

**Key advantage over NullPay:** NullPay stores `payment_receipts.set(key, amount)` which leaks actual payment amounts in public mappings. PrivateSplit stores zero amounts in any public mapping.

### Technical Stats
- 45 source files (41 frontend + 2 contract + 2 backend)
- 0 TypeScript errors
- 264KB JS bundle (81KB gzip)
- Build time: ~2s
