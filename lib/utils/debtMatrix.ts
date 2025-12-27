
interface ExpenseSplit {
  id: string;
  userId: string;
  amount: number;
  percentage?: number | null;
  isPaid: boolean;
  user: User;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidById: string;
  paidBy: User;
  splits: ExpenseSplit[];
}

interface Settlement {
  id: string;
  fromUserId: string;
  toUserId: string;
  groupId: string;
  amount: number;
  status: string;
  // Dates from APIs are usually strings; keep them serializable
  createdAt: string;
  updatedAt: string;
  settledAt?: string | null;
}

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  createdAt: string;
}




export default function createDebtMatrix(members: User[], expenses: Expense[], settlements: Settlement[]) {
    
    const DebtMatrix: { [key: string]: { [key: string]: number } } = {};

    console.log("members", members);

  
    members.forEach(member => {
        DebtMatrix[member.id] = {};
        members.forEach(otherMember => {
            if (member.id !== otherMember.id) {
                DebtMatrix[member.id][otherMember.id] = 0;
            }
        });
    });

    

    console.log("DM initialized: ", DebtMatrix );

    // Process expenses to populate DebtMatrix
    expenses.forEach(expense => {
      const payerId = expense.paidById;
      const splits = expense.splits ?? [];
      splits.forEach(split => {
        const debtorId = split.userId;
        const amountOwed = split.amount ?? 0;
        if (!DebtMatrix[debtorId]) {
          DebtMatrix[debtorId] = {};
        }
        if (!DebtMatrix[payerId]) {
          DebtMatrix[payerId] = {};
        }
        if (payerId !== debtorId) {
          DebtMatrix[debtorId][payerId] = (DebtMatrix[debtorId][payerId] ?? 0) + amountOwed;
          DebtMatrix[payerId][debtorId] = (DebtMatrix[payerId][debtorId] ?? 0) - amountOwed;
        }
      });
    });
    // Process settlements to update DebtMatrix
    (settlements ?? []).forEach(settle => {
      const fromId = settle.fromUserId;
      const toId = settle.toUserId;
      const amountSettled = settle.amount ?? 0;
      if (!DebtMatrix[fromId]) DebtMatrix[fromId] = {};
      if (!DebtMatrix[toId]) DebtMatrix[toId] = {};
      DebtMatrix[fromId][toId] = (DebtMatrix[fromId][toId] ?? 0) - amountSettled;
      DebtMatrix[toId][fromId] = (DebtMatrix[toId][fromId] ?? 0) + amountSettled;
    }); 

    return DebtMatrix;
};


