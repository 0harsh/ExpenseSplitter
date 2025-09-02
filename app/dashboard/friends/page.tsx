export default function FriendsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
        <p className="text-gray-600 mt-2">Manage your friends and see shared expenses</p>
      </div>

      {/* Friends List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Friends</h3>
        <div className="text-center text-gray-500 py-8">
          <p>No friends added yet.</p>
          <p className="text-sm mt-2">Friends will appear here when you create groups together.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Friends Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">0</div>
            <div className="text-sm text-gray-500">Total Friends</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$0.00</div>
            <div className="text-sm text-gray-500">Shared Expenses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-500">Pending Settlements</div>
          </div>
        </div>
      </div>
    </div>
  );
}
