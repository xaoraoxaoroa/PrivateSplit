import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Split, LogEntry } from '../types/split';
import { generateId } from '../utils/format';

interface SplitState {
  splits: Split[];
  addSplit: (split: Split) => void;
  updateSplit: (splitId: string, updates: Partial<Split>) => void;
  getSplit: (splitId: string) => Split | undefined;
}

export const useSplitStore = create<SplitState>()(
  persist(
    (set, get) => ({
      splits: [],
      addSplit: (split) => set((s) => ({ splits: [split, ...s.splits] })),
      updateSplit: (splitId, updates) =>
        set((s) => ({
          splits: s.splits.map((sp) => (sp.split_id === splitId ? { ...sp, ...updates } : sp)),
        })),
      getSplit: (splitId) => get().splits.find((s) => s.split_id === splitId),
    }),
    { name: 'privatesplit-store' },
  ),
);

interface UIState {
  logs: LogEntry[];
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  logs: [],
  addLog: (message, type = 'info') =>
    set((s) => ({
      logs: [
        ...s.logs.slice(-49), // Keep last 50
        { id: generateId(), timestamp: new Date(), message, type },
      ],
    })),
  clearLogs: () => set({ logs: [] }),
}));
