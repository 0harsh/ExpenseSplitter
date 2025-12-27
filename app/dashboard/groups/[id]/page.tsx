'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import GroupHeader from '@/components/groups/GroupHeader';
import GroupStats from '@/components/groups/GroupStats';
import GroupMembers from '@/components/groups/GroupMembers';
import ExpensesAndSettlementList from '@/components/groups/ExpensesList';
import AddExpenseModal from '@/components/groups/AddExpenseModal';
import CustomPaymentModal from '@/components/groups/CustomPaymentModal';
import NetBalanceTracker from '@/components/groups/NetBalanceTracker';
import SettleAllExpenses from '@/components/groups/SettleAllExpenses';
import { Group, Expense } from '@/components/groups/types';
import { useUser } from '@/lib/UserContext';
import { useGroup } from '@/lib/GroupContext';
import createDebtMatrix from '@/lib/utils/debtMatrix';
import FindOutWhoOwesWhoComponent from '@/components/groups/FindOutWhoOwesWhoComponent';




export default function GroupPage() {
  const params = useParams();
  const groupId = params.id as string;


  const { user, loading: userLoading, error: userError } = useUser();
  const { group, loading: groupLoading, error: groupError, refetch } = useGroup();


  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCustomPayment, setShowCustomPayment] = useState(false);

  useEffect(() => {
  
  }, [group]);


  const handleAddExpenseSuccess = async () => {
    // Use context refetch to reload members/expenses/settlements
    try {
      await refetch();
    } catch (err) {
      console.error('Error refetching group after adding expense:', err);
    }
  };

  const handleCustomPaymentSuccess = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error('Error refetching group after custom payment:', err);
    }
  };

  const handleAddExpense = () => {
    console.log('Add expense clicked, currentUserId:', user?.id);
    console.log('Setting showAddExpense to true');
    setShowAddExpense(true);
  };

  const handleMakePayment = () => {
    console.log('Make payment clicked, currentUserId:', user?.id);
    setShowCustomPayment(true);
  };


  if (groupLoading || userLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading User</h2>
          <p className="text-gray-600 mb-6">{userError}</p>
        </div>
      </div>
    );
  }

  if (groupError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Group</h2>
          <p className="text-gray-600 mb-6">{groupError}</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h2>
          <p className="text-gray-600 mb-6">The group you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
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

  const totalExpenses = (group?.expenses ?? []).reduce((sum, expense) => sum + (expense?.amount ?? 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <GroupHeader 
          onAddExpense={handleAddExpense}
          onMakePayment={handleMakePayment}
        />
      </div>
      
      {/* Group Stats */}
      <div className="mb-8">
        <GroupStats 
          totalExpenses={totalExpenses} 
        />
      </div>
      
      {/* Group Members */}
      <div className="mb-8">
        <GroupMembers />
      </div>
      
      
      {/* Expenses and Settlements List */}
      <div className="mb-8">
        <ExpensesAndSettlementList />
      </div>

      {/* Optimal Settlement Plan */}
      <div className="mb-8">
        <SettleAllExpenses groupId={groupId} currentUserId={user?.id || ''} />
      </div>
      
      {/* Net Balances */}
      <div className="mb-8">
        <NetBalanceTracker />
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && user && (
        <AddExpenseModal
          isOpen={showAddExpense} 
          onClose={() => {
            console.log('Closing modal');
            setShowAddExpense(false);
          }}
          onSuccess={handleAddExpenseSuccess}
        />
      )}

      {/* Custom Payment Modal */}
      {showCustomPayment && user && (
        <CustomPaymentModal
          isOpen={showCustomPayment}
          onClose={() => setShowCustomPayment(false)}
          onSuccess={handleCustomPaymentSuccess}
        />
      )}

      {/* FindOutWhoOwesWhoComponent */}
      <FindOutWhoOwesWhoComponent />
    
    </div>
  );
}
