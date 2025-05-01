
import { Transaction, Budget, SavingGoal, FinancialTip, Category } from '@/types';

// Mock user ID
export const MOCK_USER_ID = 'user123';

// Current date in ISO string
const NOW = new Date().toISOString();

// Get date N days ago in ISO format
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    date: daysAgo(0),
    description: 'Grocery Shopping',
    amount: -78.45,
    category: 'Food',
    paymentMethod: 'Credit Card',
    userId: MOCK_USER_ID,
  },
  {
    id: 't2',
    date: daysAgo(1),
    description: 'Monthly Salary',
    amount: 3200,
    category: 'Income',
    paymentMethod: 'Bank Transfer',
    userId: MOCK_USER_ID,
  },
  {
    id: 't3',
    date: daysAgo(2),
    description: 'Coffee Shop',
    amount: -4.50,
    category: 'Food',
    paymentMethod: 'Cash',
    userId: MOCK_USER_ID,
  },
  {
    id: 't4',
    date: daysAgo(3),
    description: 'Uber Ride',
    amount: -12.99,
    category: 'Transport',
    paymentMethod: 'Credit Card',
    userId: MOCK_USER_ID,
  },
  {
    id: 't5',
    date: daysAgo(5),
    description: 'Movie Tickets',
    amount: -22.50,
    category: 'Entertainment',
    paymentMethod: 'Debit Card',
    userId: MOCK_USER_ID,
  },
  {
    id: 't6',
    date: daysAgo(7),
    description: 'Electricity Bill',
    amount: -85.20,
    category: 'Utilities',
    paymentMethod: 'Bank Transfer',
    userId: MOCK_USER_ID,
  },
  {
    id: 't7',
    date: daysAgo(7),
    description: 'Gas Station',
    amount: -45.67,
    category: 'Transport',
    paymentMethod: 'Credit Card',
    userId: MOCK_USER_ID,
  },
  {
    id: 't8',
    date: daysAgo(10),
    description: 'Online Course',
    amount: -199.99,
    category: 'Education',
    paymentMethod: 'Credit Card',
    userId: MOCK_USER_ID,
  },
  {
    id: 't9',
    date: daysAgo(12),
    description: 'Pharmacy',
    amount: -32.50,
    category: 'Health',
    paymentMethod: 'Cash',
    userId: MOCK_USER_ID,
  },
  {
    id: 't10',
    date: daysAgo(15),
    description: 'Rent Payment',
    amount: -1200,
    category: 'Housing',
    paymentMethod: 'Bank Transfer',
    userId: MOCK_USER_ID,
  }
];

// Mock budget limits
export const mockBudgets: Budget[] = [
  { userId: MOCK_USER_ID, category: 'Food', limit: 500, spent: 82.95 },
  { userId: MOCK_USER_ID, category: 'Transport', limit: 200, spent: 58.66 },
  { userId: MOCK_USER_ID, category: 'Entertainment', limit: 100, spent: 22.50 },
  { userId: MOCK_USER_ID, category: 'Shopping', limit: 150, spent: 0 },
  { userId: MOCK_USER_ID, category: 'Housing', limit: 1500, spent: 1200 },
  { userId: MOCK_USER_ID, category: 'Utilities', limit: 200, spent: 85.20 },
  { userId: MOCK_USER_ID, category: 'Health', limit: 100, spent: 32.50 },
  { userId: MOCK_USER_ID, category: 'Education', limit: 200, spent: 199.99 },
];

// Mock saving goals
export const mockSavingGoals: SavingGoal[] = [
  {
    id: 'g1',
    userId: MOCK_USER_ID,
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 2500,
    targetDate: daysAgo(-90), // 90 days in the future
  },
  {
    id: 'g2',
    userId: MOCK_USER_ID,
    name: 'Vacation',
    targetAmount: 1500,
    currentAmount: 750,
    targetDate: daysAgo(-60), // 60 days in the future
  }
];

// Mock financial tips
export const mockFinancialTips: FinancialTip[] = [
  {
    id: 'tip1',
    title: '50/30/20 Budgeting Rule',
    content: 'Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.',
    category: 'Budgeting',
    imageUrl: 'https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: 'tip2',
    title: 'Building an Emergency Fund',
    content: 'Aim to save 3-6 months of living expenses for unexpected emergencies.',
    category: 'Saving',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: 'tip3',
    title: 'Debt Snowball Method',
    content: 'Pay off your smallest debts first to build momentum, then tackle larger ones.',
    category: 'Debt',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: 'tip4',
    title: 'The Power of Compound Interest',
    content: 'Start investing early to take advantage of compound growth over time.',
    category: 'Investment',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=200&h=200',
  },
];

// Helper function to categorize transaction based on description
export const categorizeTransaction = (description: string): Category => {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('grocery') || lowerDesc.includes('restaurant') || 
      lowerDesc.includes('food') || lowerDesc.includes('coffee')) {
    return 'Food';
  }
  
  if (lowerDesc.includes('uber') || lowerDesc.includes('lyft') || 
      lowerDesc.includes('gas') || lowerDesc.includes('transport')) {
    return 'Transport';
  }
  
  if (lowerDesc.includes('movie') || lowerDesc.includes('netflix') || 
      lowerDesc.includes('entertainment')) {
    return 'Entertainment';
  }
  
  if (lowerDesc.includes('rent') || lowerDesc.includes('mortgage')) {
    return 'Housing';
  }
  
  if (lowerDesc.includes('electricity') || lowerDesc.includes('water') || 
      lowerDesc.includes('utility') || lowerDesc.includes('bill')) {
    return 'Utilities';
  }
  
  if (lowerDesc.includes('doctor') || lowerDesc.includes('pharmacy') || 
      lowerDesc.includes('health')) {
    return 'Health';
  }
  
  if (lowerDesc.includes('course') || lowerDesc.includes('school') || 
      lowerDesc.includes('education')) {
    return 'Education';
  }
  
  if (lowerDesc.includes('salary') || lowerDesc.includes('income') || 
      lowerDesc.includes('deposit')) {
    return 'Income';
  }
  
  return 'Other';
};

// Calculate total income for a given transaction list
export const calculateIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total expenses for a given transaction list
export const calculateExpenses = (transactions: Transaction[]): number => {
  return Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));
};

// Get expense breakdown by category
export const getExpensesByCategory = (transactions: Transaction[]): Record<Category, number> => {
  const expensesByCategory: Partial<Record<Category, number>> = {};
  
  transactions
    .filter(t => t.amount < 0)
    .forEach(t => {
      if (!expensesByCategory[t.category]) {
        expensesByCategory[t.category] = 0;
      }
      expensesByCategory[t.category]! += Math.abs(t.amount);
    });
    
  return expensesByCategory as Record<Category, number>;
};
