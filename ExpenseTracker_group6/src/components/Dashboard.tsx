import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionList from '@/components/TransactionList';
import BudgetOverview from '@/components/BudgetOverview';
import FinancialInsights from '@/components/FinancialInsights';
import SavingGoals from '@/components/SavingGoals';
import FinancialTips from '@/components/FinancialTips';
import PDFUploader from '@/components/PDFUploader';
import { calculateExpenses, calculateIncome, getExpensesByCategory, mockTransactions } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PlusCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import TransactionForm from './TransactionForm';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Transaction, Currency } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  currency: Currency | string;
}

const Dashboard = ({ currency }: DashboardProps) => {
  const isMobile = useIsMobile();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  
  const totalIncome = calculateIncome(transactions);
  const totalExpenses = calculateExpenses(transactions);
  const balance = totalIncome - totalExpenses;
  
  const expensesByCategory = getExpensesByCategory(transactions);
  const expensesData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF', '#8B5CF6', '#D946EF'];
  
  const handleAddTransaction = (newTransaction: any) => {
    setTransactions([...transactions, { ...newTransaction, id: `t${transactions.length + 1}` }]);
  };

  const handleImportedTransactions = (importedTransactions: Transaction[]) => {
    setTransactions([...importedTransactions, ...transactions]);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (updatedTransaction: Partial<Transaction>) => {
    if (!editingTransaction) return;
    
    const updatedTransactions = transactions.map(t => 
      t.id === editingTransaction.id ? { ...t, ...updatedTransaction } : t
    );
    
    setTransactions(updatedTransactions);
    setEditingTransaction(null);
    
    toast({
      title: "Transaction updated",
      description: "Your transaction has been successfully updated.",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been successfully deleted.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-500">Track your expenses and manage your budget</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 lg:mt-0" size="lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Transaction</DialogTitle>
            <TransactionForm onSubmit={handleAddTransaction} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className={balance >= 0 ? "text-green-600" : "text-red-600"}>
              {currency}{balance.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Income</CardDescription>
            <CardTitle className="text-green-600">{currency}{totalIncome.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expenses</CardDescription>
            <CardTitle className="text-red-600">{currency}{totalExpenses.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full mb-8">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList 
                transactions={transactions} 
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
              
              {/* Edit Transaction Dialog */}
              <Dialog open={editingTransaction !== null} onOpenChange={(open) => !open && setEditingTransaction(null)}>
                <DialogContent>
                  <DialogTitle>Edit Transaction</DialogTitle>
                  {editingTransaction && (
                    <TransactionForm 
                      onSubmit={handleUpdateTransaction} 
                      initialValues={editingTransaction} 
                      isEditing={true}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Track your spending against budget limits</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetOverview />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Financial Insights</CardTitle>
              <CardDescription>Understand your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Expenses by Category</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={isMobile ? 80 : 100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {expensesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <FinancialInsights transactions={transactions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Saving Goals</CardTitle>
              <CardDescription>Track progress toward your financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <SavingGoals />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>Financial Education</CardTitle>
              <CardDescription>Tips and articles to improve your financial health</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialTips />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Transactions</CardTitle>
              <CardDescription>Upload bank statements to automatically import transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PDFUploader onTransactionsImported={handleImportedTransactions} />
                <div className="flex flex-col justify-center items-center">
                  <div className="p-4 bg-purple-50 rounded-lg mb-4">
                    <FileText className="h-12 w-12 text-purple-700" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">AI-Powered Classification</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Our AI automatically categorizes your transactions based on transaction descriptions,
                    saving you time and helping you understand your spending patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
