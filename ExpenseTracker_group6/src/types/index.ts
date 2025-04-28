
// Define main types for the expense tracker application

// User profile
export interface User {
  id: string;
  name: string;
  email: string;
  budgetPreferences?: Record<string, number>;
  preferredCurrency?: string;
}

// Transaction with category and amount
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  userId: string;
  currency?: Currency | string;
}

// Available categories for transactions
export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Housing' 
  | 'Utilities' 
  | 'Health' 
  | 'Education' 
  | 'Personal' 
  | 'Other'
  | 'Income';

// Payment methods
export type PaymentMethod = 
  | 'Cash' 
  | 'Credit Card' 
  | 'Debit Card' 
  | 'Bank Transfer' 
  | 'UPI' 
  | 'Other';

// Budget configuration
export interface Budget {
  userId: string;
  category: Category;
  limit: number;
  spent: number;
}

// Financial goal
export interface SavingGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
}

// Financial tip or article
export interface FinancialTip {
  id: string;
  title: string;
  content: string;
  category: 'Saving' | 'Budgeting' | 'Investment' | 'Debt' | 'General';
  imageUrl?: string;
}

// Currency type
export type Currency = '$' | '€' | '£' | '¥' | '₹' | '₩';

// Account types for the Account page
export type AccountType = 
  | 'Checking' 
  | 'Savings' 
  | 'Investment' 
  | 'Credit Card' 
  | 'Loan'
  | 'Mortgage'
  | 'Retirement'
  | 'Other';

// Financial account
export interface FinancialAccount {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency | string;
  institution?: string;
  interestRate?: number;
  isAsset: boolean;  // true for assets, false for liabilities
  notes?: string;
  lastUpdated: string;
}
