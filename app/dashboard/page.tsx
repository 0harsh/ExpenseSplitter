import GroupsList from '@/components/groups/GroupsList';
import ExpensesList from '@/components/expenses/ExpensesList';
import SettlementsList from '@/components/settlements/SettlementsList';

export default function DashboardPage() {
  return (
    <>
      {/* Groups */}
      <GroupsList />

      {/* Expenses */}
      <ExpensesList />

      {/* Settlements */}
      <SettlementsList />

      {/* Quick Stats */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">0</div>
            <div className="text-sm text-gray-500">Active Groups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$0.00</div>
            <div className="text-sm text-gray-500">Total Expenses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-500">Pending Settlements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
        </div>
      </div>
    </>
  );
}
