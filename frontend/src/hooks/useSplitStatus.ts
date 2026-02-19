import { useState, useEffect, useCallback, useRef } from 'react';
import { getSplitStatus } from '../utils/aleo-utils';

interface SplitOnChainStatus {
  participant_count: number;
  payment_count: number;
  status: number; // 0 = active, 1 = settled
}

const POLL_INTERVAL_MS = 30_000; // Auto-refresh every 30s

export function useSplitStatus(splitId: string | undefined) {
  const [data, setData] = useState<SplitOnChainStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!splitId) return;
    setLoading(true);
    try {
      const status = await getSplitStatus(splitId);
      setData(status);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [splitId]);

  // Initial fetch + auto-poll while split is active
  useEffect(() => {
    refresh();

    // Auto-poll every 30s (stops when split is settled/expired or component unmounts)
    intervalRef.current = setInterval(() => {
      refresh();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  // Stop polling once split is settled or expired
  useEffect(() => {
    if (data && data.status !== 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [data]);

  return { data, loading, refresh };
}
