import { BACKEND_URL } from '../utils/constants';
import type { Split } from '../types/split';

const API = BACKEND_URL + '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getSplits: () => request<Split[]>('/splits'),

  getSplitsByCreator: (address: string) => request<Split[]>(`/splits/creator/${address}`),

  getSplit: (splitId: string) => request<Split>(`/splits/${splitId}`),

  getRecentSplits: () => request<Split[]>('/splits/recent'),

  createSplit: (data: {
    split_id: string;
    creator: string;
    total_amount: number;
    per_person: number;
    participant_count: number;
    salt: string;
    description: string;
    transaction_id: string;
    participants: string[];
  }) => request<Split>('/splits', { method: 'POST', body: JSON.stringify(data) }),

  updateSplit: (splitId: string, updates: Partial<Split>) =>
    request<Split>(`/splits/${splitId}`, { method: 'PATCH', body: JSON.stringify(updates) }),
};
