import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../design-system/cn';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { WalletMultiButton } from '@provablehq/aleo-wallet-adaptor-react-ui';
import { truncateAddress } from '../../utils/format';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard' },
  { path: '/create', label: 'Create' },
  { path: '/history', label: 'My Splits' },
  { path: '/explorer', label: 'Explorer' },
  { path: '/privacy', label: 'Privacy' },
  { path: '/verify', label: 'Verify' },
];

export function CommandBar() {
  const location = useLocation();
  const { address, connected } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="border-b border-white/[0.06] bg-terminal-surface/80 backdrop-blur-xl px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-terminal-green/10 border border-terminal-green/20 flex items-center justify-center">
                <span className="text-terminal-green text-sm font-bold">&loz;</span>
              </div>
              <span className="text-terminal-text font-semibold text-sm tracking-wide">
                PrivateSplit
              </span>
            </Link>
            <nav className="desktop-nav flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium tracking-wide rounded-lg transition-colors',
                    location.pathname === item.path
                      ? 'text-terminal-green bg-terminal-green/10'
                      : 'text-terminal-dim hover:text-terminal-text hover:bg-white/[0.03]',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {connected && address && (
              <Link to="/connect" className="text-xs font-mono text-terminal-green/80 hidden sm:block hover:text-terminal-green transition-colors">
                {truncateAddress(address)}
              </Link>
            )}
            <div className="wallet-adapter-wrapper">
              <WalletMultiButton className="!bg-terminal-green/10 !border !border-terminal-green/30 !text-terminal-green !font-sans !text-xs !font-medium !tracking-wide !px-4 !py-2 !rounded-glass-sm !h-auto hover:!bg-terminal-green hover:!text-terminal-bg !transition-all !min-w-0" />
            </div>
            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn items-center justify-center w-8 h-8 text-terminal-dim hover:text-terminal-text rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? '\u2715' : '\u2630'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="mobile-nav-overlay fixed inset-0 z-50 bg-terminal-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-4 md:hidden">
          <button
            className="absolute top-4 right-4 text-terminal-dim hover:text-terminal-text text-xl"
            onClick={() => setMobileOpen(false)}
          >
            {'\u2715'}
          </button>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'text-lg tracking-wide font-medium transition-colors py-2',
                location.pathname === item.path
                  ? 'text-terminal-green'
                  : 'text-terminal-dim hover:text-terminal-text',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
