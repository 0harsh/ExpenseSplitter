import Link from 'next/link';
import { useGroup } from '@/lib/GroupContext';

interface GroupHeaderProps {
  onAddExpense: () => void;
  onMakePayment: () => void;
}

export default function GroupHeader({ onAddExpense, onMakePayment }: GroupHeaderProps) {
  const { group, loading } = useGroup();

  // Show a lightweight placeholder while the group is loading
  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-64 bg-gray-200 rounded" />
      </div>
    );
  }

  // If group is missing (not found / error), render a fallback
  if (!group) {
    return (
      <div className="mb-8">
        <div className="text-red-600">Group not found</div>
      </div>
    );
  }

  const title = group.name ?? 'Untitled Group';
  const description = group.description ?? '';

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              ← Back to Groups
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600 mt-2">{description}</p>}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onMakePayment}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Make Payment
          </button>
          <button
            onClick={onAddExpense}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}