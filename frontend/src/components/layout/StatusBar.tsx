import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { truncateAddress } from '../../utils/format';
import { STATUS_SYMBOLS } from '../../design-system/tokens';

export function StatusBar() {
  const { connected, address } = useWallet();

  return (
    <footer className="border-t border-terminal-border bg-terminal-surface px-4 py-1.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-[10px] font-mono tracking-wider">
        <div className="flex items-center gap-4">
          <span className="text-terminal-cyan">TESTNET</span>
          <span className="text-terminal-dim">{STATUS_SYMBOLS.separator}</span>
          <span className="text-terminal-dim">private_split_v1.aleo</span>
        </div>
        <div className="flex items-center gap-4">
          {connected ? (
            <>
              <span className="text-terminal-green">{STATUS_SYMBOLS.active} CONNECTED</span>
              <span className="text-terminal-dim">{STATUS_SYMBOLS.separator}</span>
              <span className="text-terminal-text">{address ? truncateAddress(address, 8) : ''}</span>
            </>
          ) : (
            <span className="text-terminal-dim">{STATUS_SYMBOLS.pending} DISCONNECTED</span>
          )}
        </div>
      </div>
    </footer>
  );
}
