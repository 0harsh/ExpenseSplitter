"use client";

import { useUser } from '@/lib/UserContext';
import { useGroup } from '@/lib/GroupContext';
import { useState, useMemo } from 'react';

export default function FindOutWhoOwesWhoComponent() {
  const { group } = useGroup();
  const { user } = useUser();

  const [user1, setUser1] = useState<string>('');
  const [user2, setUser2] = useState<string>('');
  const [amountOwed, setAmountOwed] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  const membersList = useMemo(() => (group?.members ?? []).map((m: any) => (m && m.user ? m.user : m)), [group?.members]);

  const canCheck = !!user1 && !!user2 && user1 !== user2;

  const formatCurrency = (value: number) => {
    try {
      return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
    } catch {
      return `₹${value.toFixed(2)}`;
    }
  };

  const handleCheck = () => {
    setMessage('');
    setAmountOwed(null);

    if (!user1 || !user2) {
      setMessage('Please select both users to compare.');
      return;
    }

    if (user1 === user2) {
      setMessage('Select two different users.');
      return;
    }

    // Prefer the server-provided debtMatrix attached to the group
    const matrix: { [key: string]: { [key: string]: number } } = (group as any)?.debtMatrix ?? {};

    const raw = matrix?.[user1]?.[user2];
    const amt = typeof raw === 'number' ? raw : parseFloat(String(raw || 0)) || 0;

    setAmountOwed(amt);

    const u1 = membersList.find((m) => m.id === user1);
    const u2 = membersList.find((m) => m.id === user2);

    const name1 = u1 ? (u1.id === user?.id ? 'You' : u1.name || u1.username) : user1;
    const name2 = u2 ? (u2.id === user?.id ? 'You' : u2.name || u2.username) : user2;

    if (amt > 0) {
      setMessage(`${name1} owes ${name2} ₹${amt.toFixed(2)}`);
    } else if (amt < 0) {
      setMessage(`${name2} owes ${name1} ₹${Math.abs(amt).toFixed(2)}`);
    } else {
      setMessage(`No outstanding balance between ${name1} and ${name2}`);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Find Out Who Owes Who</h2>

      <div className="space-y-4 max-w-md">
        <div className="relative flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600">User A</label>
            <select
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">-- select user --</option>
              {membersList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id === user?.id ? `You (${m.name || m.username})` : m.name || m.username}
                </option>
              ))}
            </select>
          </div>

          
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600">User B</label>
            <select
              value={user2}
              onChange={(e) => setUser2(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">-- select user --</option>
              {membersList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id === user?.id ? `You (${m.name || m.username})` : m.name || m.username}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-3">
            <button
              type="button"
              onClick={handleCheck}
              disabled={!canCheck}
              aria-disabled={!canCheck}
              className={`px-4 py-2 rounded-md shadow-sm text-white ${canCheck ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Check
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-100">
            <p className="text-sm">{message}</p>
            {typeof amountOwed === 'number' && amountOwed !== 0 && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white border text-sm font-medium">
                <span className="mr-2 text-gray-700">Amount:</span>
                <span className="text-green-700">{formatCurrency(Math.abs(amountOwed))}</span>
              </div>
            )}
          </div>
        )}

        {!membersList.length && (
          <div className="mt-2 p-3 text-sm text-gray-600">No members available in this group.</div>
        )}
      </div>
    </div>
  );
}
 