import { useState } from 'react';
import { TerminalCard, TerminalInput, TerminalButton, TerminalSelect } from '../ui';
import { MAX_PARTICIPANTS, MIN_PARTICIPANTS } from '../../utils/constants';

interface SplitFormProps {
  onSubmit: (data: { description: string; amount: string; participantCount: number; participants: string[] }) => void;
  loading?: boolean;
}

export function SplitForm({ onSubmit, loading }: SplitFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [participantCount, setParticipantCount] = useState(2);
  const [participants, setParticipants] = useState<string[]>(['']);

  const handleCountChange = (count: number) => {
    setParticipantCount(count);
    // Adjust participants array (count - 1 because creator is one participant)
    const debtCount = count - 1;
    const current = [...participants];
    while (current.length < debtCount) current.push('');
    setParticipants(current.slice(0, debtCount));
  };

  const handleParticipantChange = (index: number, value: string) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ description, amount, participantCount, participants });
  };

  const countOptions = Array.from(
    { length: MAX_PARTICIPANTS - MIN_PARTICIPANTS + 1 },
    (_, i) => ({ value: i + MIN_PARTICIPANTS, label: `${i + MIN_PARTICIPANTS} people` }),
  );

  return (
    <form onSubmit={handleSubmit}>
      <TerminalCard title="NEW SPLIT">
        <div className="space-y-4">
          <TerminalInput
            label="Description"
            placeholder="dinner, groceries, rent..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TerminalInput
            label="Total Amount (credits)"
            placeholder="10.0"
            type="number"
            step="0.000001"
            min="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <TerminalSelect
            label="Participants"
            options={countOptions}
            value={participantCount}
            onChange={(e) => handleCountChange(parseInt(e.target.value))}
          />

          {amount && participantCount > 0 && (
            <div className="text-xs text-terminal-dim border-t border-terminal-border pt-3">
              {STATUS_SYMBOLS_TEXT} Each person pays:{' '}
              <span className="text-terminal-green">
                {(parseFloat(amount || '0') / participantCount).toFixed(6)} credits
              </span>
            </div>
          )}

          <div className="space-y-2 border-t border-terminal-border pt-3">
            <p className="text-xs text-terminal-dim tracking-widest uppercase">Participant Addresses</p>
            {participants.map((addr, i) => (
              <TerminalInput
                key={i}
                placeholder={`aleo1... (participant ${i + 1})`}
                value={addr}
                onChange={(e) => handleParticipantChange(i, e.target.value)}
              />
            ))}
          </div>

          <TerminalButton type="submit" loading={loading} className="w-full">
            CREATE SPLIT
          </TerminalButton>
        </div>
      </TerminalCard>
    </form>
  );
}

const STATUS_SYMBOLS_TEXT = '→';
