import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { truncateAddress } from '../../utils/format';

export function StatusBar() {
  const { connected, address } = useWallet();

  return (
    <footer className="border-t border-white/[0.06] bg-terminal-surface/60 backdrop-blur-sm px-4 py-1.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-[10px] font-mono tracking-wider">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-cyan pulse-dot" />
            <span className="text-terminal-cyan">TESTNET</span>
          </span>
          <span className="text-white/[0.1]">|</span>
          <span className="text-terminal-dim">private_split_v1.aleo</span>
        </div>
        <div className="flex items-center gap-3">
          {connected ? (
            <>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
                <span className="text-terminal-green">CONNECTED</span>
              </span>
              <span className="text-white/[0.1]">|</span>
              <span className="text-terminal-dim">{address ? truncateAddress(address, 8) : ''}</span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-dim" />
              <span className="text-terminal-dim">DISCONNECTED</span>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
