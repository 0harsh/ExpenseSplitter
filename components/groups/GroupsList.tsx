'use client';

import { useState, useEffect } from 'react';
import CreateGroupForm from './CreateGroupForm';

interface User {
  id: string;
  name: string;
  username: string;
}

interface GroupMember {
  id: string;
  userId: string;
  user: User;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  creator: User;
  members: GroupMember[];
  _count: {
    expenses: number;
    members: number;
  };
  createdAt: string;
}

export default function GroupsList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Groups</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Group
          </button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Groups</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
          <p className="text-gray-500 mb-4">Create your first group to start splitting expenses</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {group._count.members} members
                </span>
              </div>
              
              {group.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
              )}
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Created by:</span>
                  <span className="ml-2">{group.creator.name || group.creator.username}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Expenses:</span>
                  <span className="ml-2">{group._count.expenses}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateForm && (
        <CreateGroupForm onClose={() => setShowCreateForm(false)} onSuccess={fetchGroups} />
      )}
    </div>
  );
}
