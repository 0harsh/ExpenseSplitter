import { useGroup } from '@/lib/GroupContext';

interface GroupStatsProps {
  totalExpenses: number;
}

export default function GroupStats({ totalExpenses }: GroupStatsProps) {
  const { group, loading } = useGroup();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-red-600">Group data unavailable</div>
    );
  }

  const memberCount = group.members?.length ?? 0;
  const expensesCount = group.expenses?.length ?? 0;
  const created = group.createdAt ? new Date(group.createdAt).toLocaleDateString() : '—';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2">Members</h3>
        <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{memberCount}</div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2">Total Expenses</h3>
        <div className="text-2xl sm:text-3xl font-bold text-green-600">{expensesCount}</div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2">Total Amount</h3>
        <div className="text-2xl sm:text-3xl font-bold text-purple-600">₹{totalExpenses.toFixed(2)}</div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2">Created</h3>
        <div className="text-sm sm:text-lg font-medium text-gray-600">
          {created}
        </div>
      </div>
    </div>
  );
}
