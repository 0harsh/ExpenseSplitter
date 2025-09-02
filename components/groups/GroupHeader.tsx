import Link from 'next/link';
import { Group } from './types';

interface GroupHeaderProps {
  group: Group;
  onAddExpense: () => void;
}

export default function GroupHeader({ group, onAddExpense }: GroupHeaderProps) {
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
          <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
          {group.description && (
            <p className="text-gray-600 mt-2">{group.description}</p>
          )}
        </div>
        <button
          onClick={onAddExpense}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}
