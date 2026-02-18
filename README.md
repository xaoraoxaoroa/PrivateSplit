# PrivateSplit - Privacy-First Expense Splitting on Aleo

> Split expenses with friends without revealing who owes what.

PrivateSplit is a privacy-preserving expense splitting protocol built on Aleo. Unlike Splitwise where the server sees every amount and participant, PrivateSplit keeps all financial details encrypted on-chain using zero-knowledge proofs.

**Smart Contract:** private_split_v1.aleo on Aleo Testnet
**Built for:** Aleo Privacy Buildathon by AKINDO - Wave 2

---

## Why Privacy Matters for Expense Splitting

Traditional splitting apps create permanent readable records of how much you owe, who you spend time with, and your financial patterns. PrivateSplit eliminates this by keeping all amounts, participants, and settlement details encrypted in Aleo records. The only public information is anonymous metadata: a split exists, how many people are involved, and how many have paid - with zero amounts and zero addresses.

---

## Privacy Model

| Data | Where Stored | Visibility |
|------|-------------|------------|
| Creator identity | Split record (encrypted) | Private - only creator |
| Total amount | Split record (encrypted) | Private - only creator |
| Per-person share | Split + Debt records | Private - only involved parties |
| Who owes whom | Debt record (encrypted) | Private - only debtor + creditor |
| Payment amounts | Receipt records | Private - only payer + creditor |
| Payment identity | credits.aleo/transfer_private | Private - hidden by protocol |
| Split exists | splits mapping | Public (anonymous counter) |
| Participant count | splits mapping | Public (just a number) |
| Payment count | splits mapping | Public (just a number) |
| Settlement status | splits mapping | Public (0=active 1=settled) |

**Key principle:** Private data in records (encrypted). Public mappings = only anonymous counters.

---

## Smart Contract - 5 Transitions

| # | Function | Async | Description |
|---|----------|-------|-------------|
| 1 | create_split(total, count, salt) | Yes | Creates Split record + metadata on-chain |
| 2 | issue_debt(split_record, participant) | **No** | 100% private. No finalize. |
| 3 | pay_debt(debt_record, credits_record) | Yes | Pays via credits.aleo/transfer_private |
| 4 | settle_split(split_record) | Yes | Creator closes split |
| 5 | verify_split(split_id) | Yes | Public status query |

4 Record Types: Split, Debt, PayerReceipt, CreatorReceipt
2 Mappings: splits (anonymous counters), split_salts (lookup)

issue_debt has NO finalize - issuing debts reveals nothing on-chain.

---

## User Flow

1. Creator connects Shield Wallet and creates a split (amount, participants)
2. Creator issues debts to each participant (100% private)
3. Participants receive Debt records, pay via payment link
4. Payment uses credits.aleo/transfer_private (payer hidden)
5. Both parties get encrypted receipt records
6. Creator settles when all payments received

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Leo (Aleo) |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State | Zustand + localStorage |
| Wallet | Shield Wallet (primary) |
| Backend | Node.js + Express + Supabase |
| Encryption | AES-256-GCM |
| Deployment | Vercel |

---

## How to Test

1. Install Shield Wallet extension
2. Get Aleo Testnet credits from faucet
3. Visit live demo URL
4. Connect wallet on /connect page
5. Create split on /create (description, amount, participants)
6. Issue debts from split detail page
7. Participants pay via payment link
8. Creator settles when done

---

## Privacy vs Competition

| Feature | Splitwise | Venmo | PrivateSplit |
|---------|-----------|-------|-------------|
| Server sees amounts | Yes | Yes | **No** |
| Server sees participants | Yes | Yes | **No** |
| Social graph exposed | Yes | Yes | **No** |
| Cryptographic receipts | No | No | **Yes** |
| Verifiable settlement | No | No | **Yes** |
| Self-custody | No | No | **Yes** |

---

## Wave 2 Progress

- Full Leo contract with 5 transitions and 4 record types
- Shield Wallet integration (Wave 2 mandatory)
- Real credits.aleo/transfer_private payments
- Terminal UI with unique design aesthetic
- Backend with AES-256-GCM encrypted indexing
- 4-strategy split ID retrieval
- Payment link sharing flow
- On-chain verification page

---

## Security

- Record ownership enforced by Aleo protocol
- Nullifiers handled automatically (no double-spending)
- No private data in finalize blocks
- 128-bit random salt per split
- AES-256-GCM off-chain encryption
- COOP/COEP headers for WASM isolation

---

## License

MIT