import { useState, useEffect, useCallback } from 'react';
import { getSplitStatus } from '../utils/aleo-utils';

interface SplitOnChainStatus {
  participant_count: number;
  payment_count: number;
  status: number; // 0 = active, 1 = settled
}

export function useSplitStatus(splitId: string | undefined) {
  const [data, setData] = useState<SplitOnChainStatus | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
