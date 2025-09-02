'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';


import GroupHeader from '@/components/groups/GroupHeader';
import GroupStats from '@/components/groups/GroupStats';
import GroupMembers from '@/components/groups/GroupMembers';
import ExpensesList from '@/components/groups/ExpensesList';
import AddExpenseModal from '@/components/groups/AddExpenseModal';
import DebtTracker from '@/components/groups/DebtTracker';
import { Group, Expense } from '@/components/groups/types';

export default function GroupPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
      fetchGroupExpenses();
    }
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setGroup(data);
        
        // Extract current user ID from the group data
        // The user must be a member to view the group, so we can find them
        if (data.members && data.members.length > 0) {
          // For now, let's use the first member as the current user
          // In a real app, you'd want to get this from the auth token
          const currentMember = data.members[0];
          setCurrentUserId(currentMember.userId);
          console.log('Set current user ID from group data:', currentMember.userId);
        }
      } else if (response.status === 404) {
        console.error('Group not found');
      } else {
        console.error('Error fetching group details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
    }
  };

  const fetchGroupExpenses = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/expenses`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        console.error('Error fetching group expenses:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching group expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpenseSuccess = () => {
    fetchGroupExpenses();
    fetchGroupDetails();
    // The DebtTracker component will automatically refresh when the group data changes
  };

  const handleAddExpense = () => {
    console.log('Add expense clicked, currentUserId:', currentUserId);
    console.log('Setting showAddExpense to true');
    setShowAddExpense(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h2>
          <p className="text-gray-600 mb-6">The group you're looking for doesn't exist or you don't have access to it.</p>
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GroupHeader 
        group={group} 
        onAddExpense={handleAddExpense} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <GroupStats 
            group={group} 
            totalExpenses={totalExpenses} 
          />
        </div>
        <div>
          <DebtTracker 
            groupId={groupId}
            currentUserId={currentUserId}
          />
        </div>
      </div>
      
      <GroupMembers 
        members={group.members} 
        creatorId={group.creator.id} 
      />
      
      <ExpensesList 
        expenses={expenses} 
        onAddExpense={handleAddExpense} 
      />

      {showAddExpense && (
        <AddExpenseModal
          isOpen={showAddExpense}
          onClose={() => {
            console.log('Closing modal');
            setShowAddExpense(false);
          }}
          onSuccess={handleAddExpenseSuccess}
          groupId={groupId}
          members={group.members}
          currentUserId={currentUserId}
        />
      )}
      
      {/* Debug info */}
      <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
        <p>Debug: showAddExpense = {showAddExpense.toString()}</p>
        <p>Debug: currentUserId = {currentUserId || 'not set'}</p>
        <p>Debug: groupId = {groupId}</p>
      </div>
    </div>
  );
}
