 'use client';

import { useMemo } from 'react';
import { useGroup } from '@/lib/GroupContext';

export default function ExpensesAndSettlementList({ onAddExpense }: { onAddExpense?: () => void }) {
  const { group, loading } = useGroup();

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">Group data unavailable</div>
      </div>
    );
  }

  const expenses = group.expenses ?? [];
  const settlements = group.settlements ?? [];

  const hasItems = (expenses.length + settlements.length) > 0;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Group Expenses & Settlements</h3>
      </div>

      {!hasItems ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses or settlements yet</h3>
          <p className="text-gray-500 mb-4">Add your first expense to get started</p>
          {onAddExpense && (
            <button
              onClick={onAddExpense}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Add Expense
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {expenses.map((expense: any) => (
            <div key={expense.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{expense.title}</h4>
                  {expense.description && (
                    <p className="text-sm text-gray-500">{expense.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Paid by {expense.paidBy?.name || expense.paidBy?.username || 'Unknown'}
                  </p>
                  {expense.splits && expense.splits.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Splits:</strong>
                      <ul className="mt-1">
                        {expense.splits.map((s: any) => (
                          <li key={s.id} className="flex justify-between">
                            <span>{s.user?.name || s.user?.username || s.userId}</span>
                            <span>₹{(s.amount ?? 0).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    ₹{(expense.amount ?? 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : '—'}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {settlements.map((s: any) => (
            <div key={s.id} className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Settlement:</strong> {s.fromUser?.name || s.fromUser?.username || s.fromUserId} → {s.toUser?.name || s.toUser?.username || s.toUserId}
                  </p>
                  <p className="text-sm text-gray-500">Status: {s.status}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">₹{(s.amount ?? 0).toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
