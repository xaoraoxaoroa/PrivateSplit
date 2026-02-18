import { TerminalCard } from '../components/ui';
import { STATUS_SYMBOLS } from '../design-system/tokens';
import { PROGRAM_ID } from '../utils/constants';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gradient">How Privacy Works</h1>
        <p className="text-xs text-terminal-dim mt-1">
          Every expense amount, every participant, every debt &mdash; encrypted using zero-knowledge proofs
        </p>
      </div>

      {/* The Core Insight */}
      <TerminalCard title="THE PRIVACY GUARANTEE">
        <div className="text-xs space-y-3">
          <p className="text-terminal-green font-medium">
            PrivateSplit stores ZERO amounts and ZERO addresses in any public mapping.
          </p>
          <p className="text-terminal-dim">
            When you split a $120 dinner with 3 friends, all an on-chain observer can see is:
          </p>
          <div className="bg-terminal-bg/60 border border-white/[0.06] rounded-glass-sm p-4 font-mono space-y-1 mt-2">
            <p className="text-terminal-dim">// What the Aleo blockchain shows:</p>
            <p className="text-terminal-text">splits[0x4a8f...] = {'{'}</p>
            <p className="text-terminal-text pl-4">participant_count: <span className="text-terminal-green">3</span></p>
            <p className="text-terminal-text pl-4">payment_count: <span className="text-terminal-green">2</span></p>
            <p className="text-terminal-text pl-4">status: <span className="text-terminal-green">0</span> <span className="text-terminal-dim">// active</span></p>
            <p className="text-terminal-text">{'}'}</p>
            <p className="text-terminal-dim mt-3">// That's it. No amounts. No names. No addresses.</p>
          </div>
        </div>
      </TerminalCard>

      {/* What's Visible vs Hidden */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TerminalCard title="WHAT AN OBSERVER SEES">
          <div className="space-y-2.5 text-xs">
            {[
              'A split exists (anonymous field ID)',
              '3 people are involved (just a count)',
              '2 have paid (just a count)',
              'It\'s still active (0 or 1)',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-terminal-amber shrink-0">{STATUS_SYMBOLS.pending}</span>
                <span className="text-terminal-dim">{item}</span>
              </div>
            ))}
            <div className="border-t border-white/[0.06] pt-3 mt-3">
              <p className="text-terminal-dim">That's ALL. No amounts, no addresses, no names, no history.</p>
            </div>
          </div>
        </TerminalCard>

        <TerminalCard title="WHAT PARTICIPANTS SEE" variant="accent">
          <div className="space-y-2.5 text-xs">
            {[
              'Creator: total $120, each person owes $40',
              'Debtor: "I owe Alice $40 for dinner"',
              'Payer: encrypted receipt proving payment',
              'Creator: encrypted receipt proving receipt',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-terminal-green shrink-0">{STATUS_SYMBOLS.success}</span>
                <span className="text-terminal-text">{item}</span>
              </div>
            ))}
            <div className="border-t border-white/[0.06] pt-3 mt-3">
              <p className="text-terminal-green">All stored in encrypted Aleo records. Only you can decrypt yours.</p>
            </div>
          </div>
        </TerminalCard>
      </div>

      {/* Data Flow Diagram */}
      <TerminalCard title="DATA FLOW">
        <div className="font-mono text-[11px] leading-relaxed overflow-x-auto">
          <pre className="text-terminal-dim whitespace-pre">
{`
  CREATOR                              PARTICIPANT
    │                                       │
    ├─ create_split(amount, 3, salt)         │
    │   ┌──────────────────────────┐         │
    │   │ Split Record (ENCRYPTED) │         │
    │   │ owner: creator           │         │
    │   │ amount: 120 credits      │         │
    │   │ per_person: 40 credits   │         │
    │   └──────────────────────────┘         │
    │                                        │
    │   On-chain: {count:3, paid:0, status:0}│
    │   `}<span className="text-terminal-amber">NO amounts. NO addresses.</span>{`      │
    │                                        │
    ├─ issue_debt(split, participant)         │
    │   `}<span className="text-terminal-green">★ NO FINALIZE — ZERO on-chain trace</span>{`  │
    │                     ┌─────────────────►│
    │                     │ Debt Record      │
    │                     │ (ENCRYPTED)      │
    │                     │ amount: 40       │
    │                     │ creditor: creator │
    │                     └─────────────────►│
    │                                        │
    │                        pay_debt ◄──────┤
    │   `}<span className="text-terminal-cyan">credits.aleo/transfer_private</span>{`       │
    │   (payer identity HIDDEN by protocol)  │
    │                                        │
    │   ┌──────────────┐  ┌─────────────────►│
    │   │CreatorReceipt│  │ PayerReceipt     │
    │   │ (ENCRYPTED)  │  │ (ENCRYPTED)      │
    │   └──────────────┘  └─────────────────►│
    │                                        │
    │   On-chain: {count:3, `}<span className="text-terminal-green">paid:1</span>{`, status:0}│
    │   `}<span className="text-terminal-amber">Still NO amounts. NO addresses.</span>{`    │
    │                                        │
    ├─ settle_split(split)                   │
    │   On-chain: status → 1 (SETTLED)       │
    │   `}<span className="text-terminal-green">Only record owner can settle</span>{`       │
`}
          </pre>
        </div>
      </TerminalCard>

      {/* Privacy Comparison */}
      <TerminalCard title="PRIVACY COMPARISON">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-terminal-dim text-left">
                <th className="pb-3 pr-4 font-medium">Data Point</th>
                <th className="pb-3 pr-4 font-medium">Splitwise</th>
                <th className="pb-3 pr-4 font-medium">Venmo</th>
                <th className="pb-3 pr-4 font-medium">Other ZK</th>
                <th className="pb-3 text-terminal-green font-medium">PrivateSplit</th>
              </tr>
            </thead>
            <tbody className="text-terminal-text">
              {[
                { point: 'Amounts visible', sw: 'Server sees all', venmo: 'Server sees all', zk: 'Public inputs', ps: 'NEVER' },
                { point: 'Addresses visible', sw: 'Server sees all', venmo: 'Public by default', zk: 'Public inputs', ps: 'NEVER' },
                { point: 'Who owes whom', sw: 'Server stores', venmo: 'N/A', zk: 'On-chain hash', ps: 'NO TRACE' },
                { point: 'Social graph', sw: 'Fully mapped', venmo: 'Fully mapped', zk: 'Partial', ps: 'HIDDEN' },
                { point: 'Payment proof', sw: 'None', venmo: 'None', zk: 'Yes', ps: 'ENCRYPTED RECEIPTS' },
                { point: 'Self-custody', sw: 'No', venmo: 'No', zk: 'Yes', ps: 'YES' },
              ].map((row, i) => (
                <tr key={i} className="border-t border-white/[0.06]">
                  <td className="py-2.5 pr-4 text-terminal-dim">{row.point}</td>
                  <td className="py-2.5 pr-4 text-terminal-red/80">{row.sw}</td>
                  <td className="py-2.5 pr-4 text-terminal-red/80">{row.venmo}</td>
                  <td className="py-2.5 pr-4 text-terminal-amber/80">{row.zk}</td>
                  <td className="py-2.5 text-terminal-green font-semibold">{row.ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TerminalCard>

      {/* Technical Details */}
      <TerminalCard title="TECHNICAL DETAILS">
        <div className="space-y-5 text-xs">
          {[
            { title: 'Record Model (UTXO-like)', desc: 'Aleo records are consumed and recreated on each transition. Only the owner can spend them. Nullifiers prevent double-spending. Encryption is automatic.', color: 'text-terminal-green' },
            { title: 'Zero-Knowledge Proofs', desc: 'Every transition generates a ZK proof that the computation was correct without revealing the inputs. Validators verify the proof, not the data.', color: 'text-terminal-cyan' },
            { title: 'credits.aleo/transfer_private', desc: 'Payments use Aleo\'s native private transfer. Sender identity, receiver identity, and amount are all hidden.', color: 'text-terminal-purple' },
            { title: 'No Finalize on Debt Issuance', desc: 'The issue_debt transition has no finalize block. There is literally zero on-chain evidence that a debt was issued. The encrypted Debt record appears only in the participant\'s wallet.', color: 'text-terminal-amber' },
          ].map((item, i) => (
            <div key={i}>
              <p className={`${item.color} tracking-wider uppercase mb-1.5 font-medium`}>{item.title}</p>
              <p className="text-terminal-dim leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </TerminalCard>

      {/* Program Info */}
      <TerminalCard title="ON-CHAIN PROGRAM">
        <div className="space-y-2 text-xs">
          {[
            { label: 'Program ID', value: PROGRAM_ID, mono: true },
            { label: 'Network', value: 'Aleo Testnet', color: 'text-terminal-cyan' },
            { label: 'Transitions', value: '5 (create, issue, pay, settle, verify)' },
            { label: 'Records', value: '4 (Split, Debt, PayerReceipt, CreatorReceipt)' },
            { label: 'Public Mappings', value: '2 (anonymous counters only)' },
            { label: 'Amounts in Mappings', value: '0', color: 'text-terminal-green font-semibold' },
            { label: 'Addresses in Mappings', value: '0', color: 'text-terminal-green font-semibold' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-terminal-dim">{item.label}</span>
              <span className={item.color || (item.mono ? 'text-terminal-text font-mono' : 'text-terminal-text')}>{item.value}</span>
            </div>
          ))}
          <div className="border-t border-white/[0.06] pt-3 mt-3">
            <a
              href={`https://testnet.explorer.provable.com/program/${PROGRAM_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-cyan hover:text-terminal-green transition-colors"
            >
              {STATUS_SYMBOLS.arrow} View contract on Provable Explorer
            </a>
          </div>
        </div>
      </TerminalCard>
    </div>
  );
}
