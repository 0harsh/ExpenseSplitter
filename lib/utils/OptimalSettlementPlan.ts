

import { User } from '@/components/groups/types';
  

interface MemberBalance {
  userId: string;
  user: User;
  netBalance: number;
}


interface SettlementTransaction {
  fromUserId: string;
  fromUser: User;
  toUserId: string;
  toUser: User;
  amount: number;
}




export default function OptimalSettlementPlan({ debtMatrix, groupMembers }: { debtMatrix: {[key: string]: {[key: string]: number}}, groupMembers: User[] }) {

    
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


      // sort balances on the basis of netBalance
      balances.sort((a, b) => a.netBalance - b.netBalance);

      let i = 0;
      let j = balances.length - 1;
      const transactions: SettlementTransaction[] = [];



      while (i < j) {
        const debtor = balances[i];
        const creditor = balances[j];
        const settlementAmount = Math.min(-debtor.netBalance, creditor.netBalance);

        if (settlementAmount > 0.01) {
          transactions.push({
            fromUserId: debtor.userId,
            fromUser: debtor.user,
            toUserId: creditor.userId,
            toUser: creditor.user,
            amount: settlementAmount,
          });
          debtor.netBalance += settlementAmount;
          creditor.netBalance -= settlementAmount;
        }
        
        if (Math.abs(debtor.netBalance) < 0.01) {
          i++;
        }

        if (Math.abs(creditor.netBalance) < 0.01) {
          j--;
        }
      }

      return (transactions);  
}

