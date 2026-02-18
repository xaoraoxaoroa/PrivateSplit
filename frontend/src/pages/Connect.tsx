import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { useWalletModal } from '@provablehq/aleo-wallet-adaptor-react-ui';
import { TerminalCard, TerminalButton, TerminalBadge } from '../components/ui';
import { truncateAddress } from '../utils/format';
import { STATUS_SYMBOLS } from '../design-system/tokens';

export function Connect() {
  const { connected, address, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    setVisible(true);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="text-lg text-terminal-green tracking-wider">WALLET</h1>

      {connected && address ? (
        <TerminalCard variant="accent" title="CONNECTED">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Status</span>
                <TerminalBadge status="active" label="CONNECTED" />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-terminal-dim">Address</span>
                <span className="text-terminal-text">{truncateAddress(address, 10)}</span>
              </div>
              <div className="text-xs text-terminal-dim break-all bg-terminal-bg border border-terminal-border p-2 mt-2">
                {address}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-terminal-dim border-t border-terminal-border pt-3">
              <span>Network: <span className="text-terminal-cyan">Aleo Testnet</span></span>
              <span>Wallet: <span className="text-terminal-text">Shield</span></span>
            </div>

            <TerminalButton onClick={disconnect} variant="danger" className="w-full">
              DISCONNECT
            </TerminalButton>
          </div>
        </TerminalCard>
      ) : (
        <TerminalCard title="CONNECT WALLET">
          <div className="space-y-4 py-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-terminal-text">
                {STATUS_SYMBOLS.pending} Shield Wallet Required
              </p>
              <p className="text-xs text-terminal-dim max-w-sm mx-auto">
                PrivateSplit uses the Shield Wallet for Aleo blockchain interactions.
                All expense data is encrypted and private by default.
              </p>
            </div>

            <TerminalButton onClick={handleConnect} loading={connecting} className="w-full">
              CONNECT SHIELD WALLET
            </TerminalButton>

            <div className="border-t border-terminal-border pt-3 space-y-2">
              <p className="text-xs text-terminal-dim tracking-widest uppercase text-center">
                Privacy Guarantees
              </p>
              <div className="space-y-1.5 text-xs">
                <p className="text-terminal-green">{STATUS_SYMBOLS.success} Split amounts encrypted in records</p>
                <p className="text-terminal-green">{STATUS_SYMBOLS.success} Participant identities hidden</p>
                <p className="text-terminal-green">{STATUS_SYMBOLS.success} Zero-knowledge proof verification</p>
                <p className="text-terminal-green">{STATUS_SYMBOLS.success} Only counters visible on-chain</p>
              </div>
            </div>

            <div className="border-t border-terminal-border pt-3">
              <a
                href="https://shieldwallet.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-terminal-cyan hover:underline block text-center"
              >
                {STATUS_SYMBOLS.arrow} Get Shield Wallet
              </a>
            </div>
          </div>
        </TerminalCard>
      )}
    </div>
  );
}
