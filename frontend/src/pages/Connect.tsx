import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { WalletMultiButton } from '@provablehq/aleo-wallet-adaptor-react-ui';
import { TerminalCard, TerminalButton, TerminalBadge } from '../components/ui';
import { truncateAddress } from '../utils/format';
import { STATUS_SYMBOLS } from '../design-system/tokens';

export function Connect() {
  const { connected, address, disconnect, wallet } = useWallet();
  const walletName = wallet?.adapter?.name || 'Unknown';

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gradient">Wallet</h1>

      {connected && address ? (
        <TerminalCard variant="accent" title="CONNECTED">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-xs items-center">
                <span className="text-terminal-dim">Status</span>
                <TerminalBadge status="active" label="CONNECTED" />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Wallet</span>
                <span className="text-terminal-text">{walletName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Address</span>
                <span className="text-terminal-text font-mono">{truncateAddress(address, 10)}</span>
              </div>
              <div className="bg-terminal-bg/60 border border-white/[0.06] rounded-glass-sm p-3 font-mono text-xs text-terminal-dim break-all mt-2">
                {address}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-terminal-dim border-t border-white/[0.06] pt-3">
              <span>Network: <span className="text-terminal-cyan">Aleo Testnet</span></span>
              <span>Wallet: <span className="text-terminal-text">{walletName}</span></span>
            </div>

            <TerminalButton onClick={disconnect} variant="danger" className="w-full">
              DISCONNECT
            </TerminalButton>
          </div>
        </TerminalCard>
      ) : (
        <TerminalCard title="CONNECT WALLET">
          <div className="space-y-5 py-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-terminal-text font-medium">
                Choose Your Wallet
              </p>
              <p className="text-xs text-terminal-dim max-w-sm mx-auto">
                PrivateSplit supports Shield Wallet, Leo Wallet, Puzzle, Fox, and Soter.
                All expense data is encrypted and private by default.
              </p>
            </div>

            <div className="flex justify-center wallet-adapter-wrapper">
              <WalletMultiButton className="!bg-terminal-green/10 !border !border-terminal-green/30 !text-terminal-green !font-sans !text-xs !font-medium !tracking-wide !px-6 !py-3 !rounded-glass-sm hover:!bg-terminal-green hover:!text-terminal-bg !transition-all" />
            </div>

            <div className="border-t border-white/[0.06] pt-4 space-y-3">
              <p className="text-xs text-terminal-dim tracking-wider uppercase text-center font-medium">
                Supported Wallets
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Shield Wallet', 'Leo Wallet', 'Puzzle Wallet', 'Fox Wallet', 'Soter Wallet'].map((w) => (
                  <div key={w} className="flex items-center gap-2 text-terminal-green">
                    <span>{STATUS_SYMBOLS.success}</span> {w}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-4 space-y-3">
              <p className="text-xs text-terminal-dim tracking-wider uppercase text-center font-medium">
                Privacy Guarantees
              </p>
              <div className="space-y-2 text-xs">
                {[
                  'Split amounts encrypted in records',
                  'Participant identities hidden',
                  'Zero-knowledge proof verification',
                  'Only counters visible on-chain',
                ].map((item, i) => (
                  <p key={i} className="text-terminal-green flex items-center gap-2">
                    <span>{STATUS_SYMBOLS.success}</span> {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-4 flex gap-4 justify-center">
              <a
                href="https://www.leo.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-terminal-cyan hover:text-terminal-green transition-colors"
              >
                {STATUS_SYMBOLS.arrow} Shield Wallet
              </a>
              <a
                href="https://puzzle.online/wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-terminal-cyan hover:text-terminal-green transition-colors"
              >
                {STATUS_SYMBOLS.arrow} Puzzle Wallet
              </a>
            </div>
          </div>
        </TerminalCard>
      )}
    </div>
  );
}
