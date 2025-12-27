
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  createdAt: string;
}

export interface Settlement {
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


export interface ExpenseSplit {
  id: string;
  userId: string;
  amount: number;
  percentage?: number | null;
  isPaid: boolean;
  user: User;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidById: string;
  paidBy: User;
  splits: ExpenseSplit[];
}



export interface Group {
  id: string;
  name: string;
  description?: string;
  creator: User;
  members: User[];
  expenses: Expense[];
  settlements: Settlement[];
  debtMatrix: { [key: string]: { [key: string]: number } };
  createdAt: string;
}
















export type DistributionMethod = 'exact' | 'percentage';

export interface ExpenseDistributionStep {
  step: 'members' | 'distribution';
  selectedMembers: string[];
  distributionMethod: DistributionMethod;
  splits: ExpenseSplit[];
}
