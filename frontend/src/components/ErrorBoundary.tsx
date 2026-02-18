import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card glass-card-error p-6 m-4">
          <p className="text-terminal-red text-sm font-medium mb-2">
            System Error
          </p>
          <p className="text-terminal-dim text-xs mb-4 font-mono">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="bg-terminal-red/10 border border-terminal-red/40 text-terminal-red px-5 py-2.5 text-xs font-medium tracking-wider uppercase rounded-glass-sm hover:bg-terminal-red hover:text-terminal-bg transition-all"
          >
            RELOAD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
