import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../design-system/cn';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { truncateAddress } from '../../utils/format';

const NAV_ITEMS = [
  { path: '/', label: 'dashboard' },
  { path: '/create', label: 'create' },
  { path: '/history', label: 'history' },
  { path: '/explorer', label: 'explorer' },
  { path: '/verify', label: 'verify' },
];

export function CommandBar() {
  const location = useLocation();
  const { address, connected } = useWallet();

  return (
    <header className="border-b border-terminal-border bg-terminal-surface px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-terminal-green font-bold text-sm tracking-wider">
            PRIVATESPLIT
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-3 py-1 text-xs tracking-wider transition-colors',
                  location.pathname === item.path
                    ? 'text-terminal-green'
                    : 'text-terminal-dim hover:text-terminal-text',
                )}
              >
                /{item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link
          to="/connect"
          className={cn(
            'text-xs tracking-wider px-3 py-1 border transition-colors',
            connected
              ? 'border-terminal-green text-terminal-green'
              : 'border-terminal-border text-terminal-dim hover:border-terminal-text hover:text-terminal-text',
          )}
        >
          {connected && address ? truncateAddress(address) : '[ CONNECT ]'}
        </Link>
      </div>
    </header>
  );
}
