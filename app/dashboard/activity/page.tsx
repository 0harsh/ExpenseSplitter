export default function ActivityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Activity</h1>
        <p className="text-gray-600 mt-2">Track all your expense activities and recent changes</p>
      </div>

      {/* Activity Feed */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center text-gray-500 py-8">
          <p>No recent activity.</p>
          <p className="text-sm mt-2">Your expense activities will appear here.</p>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">0</div>
            <div className="text-sm text-gray-500">Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-500">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-500">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
