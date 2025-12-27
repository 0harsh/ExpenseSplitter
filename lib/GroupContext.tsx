'use client';
import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { useRef } from 'react';

import { Group } from '@/components/groups/types';
import { User } from '@/components/groups/types';
import { Expense } from '@/components/groups/types';  
import { Settlement } from '@/components/groups/types';
import createDebtMatrix from './utils/debtMatrix';


interface GroupContextType {
  group : Group | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface GroupProviderProps {
  children: ReactNode;
  groupId: string;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);


export function useGroup() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
}



export function GroupProvider({ children, groupId}: GroupProviderProps) {

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/groups/${encodeURIComponent(groupId)}`, {
        credentials: 'include',
      });

      console.log(response);
      if (response.ok) {
        const data = await response.json();
        // Normalize members shape: backend sometimes returns membership objects
        // with a nested `user` instead of a plain `User[]`.
        let members: User[] = [];
        if (Array.isArray(data?.members)) {
          if (data.members.length > 0 && data.members[0] && data.members[0].user) {
            members = data.members.map((m: any) => m.user as User);
          } else {
            members = data.members as User[];
          }
        }

        const debtMatrix = createDebtMatrix(data.members ?? [], data.expenses ?? [], data.settlements ?? []);

        const shaped: Group = {
          ...data,
          members,
          expenses: data.expenses ?? [],
          settlements: data.settlements ?? [],
          debtMatrix,
        } as Group;

        setGroup(shaped);
        console.log('fetched group', shaped);
      } else {
        setError('Failed to fetch group data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId){
      fetchData();
    }
  }, [groupId]);

  const refetch = async () => {
    await fetchData();
  };


  const value: GroupContextType = useMemo(() => ({
    group,
    loading,
    error,
    refetch,
  }), [group, loading, error, refetch]);

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
}
