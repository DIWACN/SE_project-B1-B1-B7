
import { useState } from 'react';
import { FinancialAccount } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, CreditCard, BanknoteIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountList from '@/components/AccountList';
import AccountForm from '@/components/AccountForm';
import AccountSummary from '@/components/AccountSummary';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample mock data
const mockAccounts: FinancialAccount[] = [
  {
    id: 'a1',
    userId: 'user1',
    name: 'Primary Checking',
    type: 'Checking',
    balance: 5230.45,
    currency: '$',
    institution: 'Chase Bank',
    isAsset: true,
    lastUpdated: '2023-05-15T12:00:00Z',
  },
  {
    id: 'a2',
    userId: 'user1',
    name: 'High-Yield Savings',
    type: 'Savings',
    balance: 15750.20,
    currency: '$',
    institution: 'Ally Bank',
    interestRate: 3.75,
    isAsset: true,
    lastUpdated: '2023-05-15T12:00:00Z',
  },
  {
    id: 'a3',
    userId: 'user1',
    name: 'Retirement 401(k)',
    type: 'Retirement',
    balance: 78450.33,
    currency: '$',
    institution: 'Fidelity',
    isAsset: true,
    lastUpdated: '2023-05-15T12:00:00Z',
  },
  {
    id: 'a4',
    userId: 'user1',
    name: 'Credit Card',
    type: 'Credit Card',
    balance: 2350.75,
    currency: '$',
    institution: 'Citi Bank',
    interestRate: 18.99,
    isAsset: false,
    lastUpdated: '2023-05-15T12:00:00Z',
  },
  {
    id: 'a5',
    userId: 'user1',
    name: 'Home Mortgage',
    type: 'Mortgage',
    balance: 245000.00,
    currency: '$',
    institution: 'Wells Fargo',
    interestRate: 4.25,
    isAsset: false,
    lastUpdated: '2023-05-15T12:00:00Z',
  },
];

const Account = () => {
  const [accounts, setAccounts] = useState<FinancialAccount[]>(mockAccounts);
  const [editingAccount, setEditingAccount] = useState<FinancialAccount | null>(null);
  const [currency, setCurrency] = useState<string>('$');
  const { toast } = useToast();

  const handleAddAccount = (newAccount: Partial<FinancialAccount>) => {
    const account: FinancialAccount = {
      id: `a${accounts.length + 1}`,
      userId: 'user1',
      name: newAccount.name || '',
      type: newAccount.type || 'Checking',
      balance: newAccount.balance || 0,
      currency: newAccount.currency || '$',
      institution: newAccount.institution,
      interestRate: newAccount.interestRate,
      isAsset: newAccount.isAsset !== undefined ? newAccount.isAsset : true,
      notes: newAccount.notes,
      lastUpdated: new Date().toISOString(),
    };

    setAccounts([...accounts, account]);
    
    toast({
      title: "Account added",
      description: "Your account has been successfully added.",
    });
  };

  const handleEditAccount = (account: FinancialAccount) => {
    setEditingAccount(account);
  };

  const handleUpdateAccount = (updatedAccount: Partial<FinancialAccount>) => {
    if (!editingAccount) return;
    
    const updatedAccounts = accounts.map(a => 
      a.id === editingAccount.id ? { 
        ...a, 
        ...updatedAccount, 
        lastUpdated: new Date().toISOString() 
      } : a
    );
    
    setAccounts(updatedAccounts);
    setEditingAccount(null);
    
    toast({
      title: "Account updated",
      description: "Your account has been successfully updated.",
    });
  };

  const handleDeleteAccount = (id: string) => {
    const updatedAccounts = accounts.filter(a => a.id !== id);
    setAccounts(updatedAccounts);
    
    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
    });
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    // In a real app, we would update this in user preferences
  };

  // Filter accounts by type
  const assetAccounts = accounts.filter(a => a.isAsset);
  const liabilityAccounts = accounts.filter(a => !a.isAsset);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-500">Manage your financial accounts and track your net worth</p>
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <div className="w-28">
            <Select onValueChange={handleCurrencyChange} defaultValue={currency}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">USD ($)</SelectItem>
                <SelectItem value="€">EUR (€)</SelectItem>
                <SelectItem value="£">GBP (£)</SelectItem>
                <SelectItem value="¥">JPY (¥)</SelectItem>
                <SelectItem value="₹">INR (₹)</SelectItem>
                <SelectItem value="₩">KRW (₩)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogTitle>Add New Account</DialogTitle>
              <AccountForm onSubmit={handleAddAccount} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Account Summary Section */}
      <div className="mb-8">
        <AccountSummary accounts={accounts} currency={currency} />
      </div>

      {/* Account Listing Section */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px] mb-6">
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Accounts</CardTitle>
              <CardDescription>View and manage all your financial accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountList 
                accounts={accounts} 
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-100">
                  <BanknoteIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Assets</CardTitle>
                  <CardDescription>Accounts that add to your net worth</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AccountList 
                accounts={assetAccounts} 
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="liabilities">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-red-100">
                  <CreditCard className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Liabilities</CardTitle>
                  <CardDescription>Debts and obligations that reduce your net worth</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AccountList 
                accounts={liabilityAccounts} 
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Account Dialog */}
      <Dialog open={editingAccount !== null} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>Edit Account</DialogTitle>
          {editingAccount && (
            <AccountForm 
              onSubmit={handleUpdateAccount} 
              initialValues={editingAccount} 
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
