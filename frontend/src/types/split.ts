export interface Split {
  split_id: string;
  creator: string;
  total_amount: number; // microcredits
  per_person: number;
  participant_count: number;
  issued_count: number;
  salt: string;
  description?: string;
  status: SplitStatus;
  payment_count: number;
  created_at: string;
  transaction_id?: string;
  participants?: Participant[];
}

export interface Participant {
  address: string;
  label?: string;
  paid: boolean;
  payment_tx_id?: string;
}

export type SplitStatus = 'active' | 'settled' | 'pending';

export interface SplitFormData {
  description: string;
  total_amount: string; // User enters in credits, we convert
  participant_count: number;
  participants: string[]; // Aleo addresses
}

export interface PaymentParams {
  creator: string;
  amount: string;
  salt: string;
  split_id: string;
  description?: string;
}

export type PaymentStep = 'connect' | 'verify' | 'convert' | 'pay' | 'success' | 'error';

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'system';
}
