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
- **Confirmed on-chain TX:** `at1ue3v4t5u9rsmf7h7jnee8dhr6dguda59lrct68j3d4rjhm395vqqhjwcxv`

### Frontend — Complete UI Overhaul (React 18 + TypeScript + Vite)
- **Glassmorphic design system:** Dark fintech aesthetic with transparent cards, backdrop blur, 16px border-radius, soft ambient glows
- **Dual typography:** Inter for UI text (headings, labels, body) + JetBrains Mono for data (addresses, hashes, amounts)
- **Modern color palette:** Emerald green (#34d399), cyan (#22d3ee), purple (#a78bfa), amber (#fbbf24) — refined from terminal green
- **9 functional pages:** Dashboard, Create Split, Pay Split, Split Detail, History, Explorer, Verification, Privacy, Connect
- **Status badges:** Pill-shaped badges with animated pulse dots (cyan=active, green=settled, amber=pending)
- **Progress bars:** Visual completion tracking on split cards and explorer results
- **QR code generation:** Payment links shareable via QR code on Split Detail page
- **Glassmorphic cards:** `rgba(255,255,255,0.02)` background, subtle borders, hover lift with shadow transitions
- **Ambient backgrounds:** Dual radial gradients (green top-left, purple bottom-right) for depth
- **Staggered animations:** Cards and stats fade in with offset timing for polished page loads
- **Skeleton loading states:** Shimmer animation for loading placeholders
- **Improved button design:** Rounded corners, background tints per variant, spinner for loading states
- **Improved input design:** Rounded glass inputs with green prompt accent, error state highlighting
- **Error boundaries:** Glassmorphic error cards with reload button
- **Toast notifications:** Glass-styled toasts with colored dots and auto-dismiss

### Shield Wallet Integration (Wave 2 Mandatory)
- **Full Shield Wallet support** via `@provablehq/aleo-wallet-adaptor-react`
- **5 wallet adapters:** Shield (primary), Leo, Puzzle, Fox, Soter
- **Real credits.aleo/transfer_private** payments (not mocked)
- **4-strategy split_id retrieval:** Transaction output → mapping lookup → wallet history → public chain API
- **Robust record matching** using structured field parsing (not fragile substring search)
- **Wallet adapter polling:** `wallet.adapter.transactionStatus()` for reliable TX confirmation

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

**Key advantage:** `issue_debt` has NO finalize block — zero on-chain trace of debt issuance. Other ZK payment systems must register invoices on-chain. PrivateSplit doesn't.

### Backend (Node.js + Express + Supabase)
- **AES-256-GCM encryption** for off-chain address AND amount storage
- **Fail-fast validation:** Server refuses to start without required environment variables
- **Encryption key validation:** Exactly 32 bytes (64 hex chars), no random fallback
- **PostgreSQL schema** with indexes, RLS policies, auto-updated timestamps
- **REST API:** Create, read, update splits with encrypted participant addresses

### Technical Stats
- 45+ source files (41 frontend + 2 contract + 2 backend)
- 0 TypeScript errors
- ~423KB JS bundle (~133KB gzip)
- Build time: ~2s
- 9 pages, 8 custom hooks, 7 UI components
