'use client';

import { useState, useEffect, useMemo } from 'react';
import { Group, User } from '@/components/groups/types';
import { useGroup } from '@/lib/GroupContext';
import createDebtMatrix from '@/lib/utils/debtMatrix';


interface MemberBalance {
  userId: string;
  user: User;
  netBalance: number;
}


export default function GroupMembers() {
  const { group, loading: groupLoading } = useGroup();
  const [memberBalances, setMemberBalances] = useState<MemberBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupMembers: User[] = (group?.members ?? []) as User[];
  const creatorId = group?.creator?.id ?? '';

  const debtMatrix = useMemo(() => {
    if (!group) return {} as { [key: string]: { [key: string]: number } };
    // If the server already provided a debtMatrix on the group, use it.
    if (group.debtMatrix && Object.keys(group.debtMatrix).length > 0) {
      return group.debtMatrix;
    }
    return createDebtMatrix(groupMembers, group.expenses ?? [], group.settlements ?? []);
  }, [group, groupMembers]);

  useEffect(() => {
    if (!group) return;
    fetchMemberBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, JSON.stringify(debtMatrix)]);

  const fetchMemberBalances = async () => {
    try {
      setLoading(true);

      const netBalances: { [key: string]: number } = {};

      for (const member of groupMembers) {
        let net = 0;
        for (const other of groupMembers) {
          net += debtMatrix[other.id]?.[member.id] ?? 0;
        }
        netBalances[member.id] = net;
      }

      const balances: MemberBalance[] = groupMembers.map(member => ({
        userId: member.id,
        user: member,
        netBalance: netBalances[member.id] || 0,
      }));

      setMemberBalances(balances);
      setError(null);

      // Note: memberBalances won't reflect immediately in this scope after setMemberBalances
    } catch (err) {
      // keep the console message informative
      // eslint-disable-next-line no-console
      console.error('Error fetching member balances:', err);
      setError('Error loading member balances');
    } finally {
      setLoading(false);
    }
  };

  const getMemberBalance = (userId: string): MemberBalance | undefined => {
    return memberBalances.find(balance => balance.userId === userId);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Group Members</h3>
      </div>
      <div className="p-6">
        { (groupLoading || loading) ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupMembers.map((member) => (
                <div key={member.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 text-sm mb-4">{error}</div>
            <button
              onClick={fetchMemberBalances}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupMembers.map((member) => {
              const balance = getMemberBalance(member.id);
              const displayName = member.name || member.username || '';
              const initial = String(displayName).charAt(0).toUpperCase();
              return (
                <div key={member.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-sm">
                        {initial}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {displayName}
                      </p>
                      {member.id === creatorId && (
                        <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                          Creator
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {balance && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">Net Balance</div>
                      <div className={`text-lg font-bold ${
                        balance.netBalance > 0 
                          ? 'text-green-600' 
                          : balance.netBalance < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                      }`}>
                        {balance.netBalance > 0 ? '+' : ''}₹{balance.netBalance.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {balance.netBalance > 0 
                          ? 'Owed by group' 
                          : balance.netBalance < 0 
                            ? 'Owes to group' 
                            : 'All settled'
                        }
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Refresh button */}
        {!loading && !error && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={fetchMemberBalances}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh Balances
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
