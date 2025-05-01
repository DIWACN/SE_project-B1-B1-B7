
import { useState } from 'react';
import { FinancialAccount } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CreditCard, Wallet, PiggyBank, BarChart4, Home } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AccountListProps {
  accounts: FinancialAccount[];
  onEdit?: (account: FinancialAccount) => void;
  onDelete?: (accountId: string) => void;
}

const AccountList = ({ accounts, onEdit, onDelete }: AccountListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'Checking':
      case 'Savings':
        return <Wallet className="h-4 w-4" />;
      case 'Investment':
      case 'Retirement':
        return <BarChart4 className="h-4 w-4" />;
      case 'Credit Card':
        return <CreditCard className="h-4 w-4" />;
      case 'Mortgage':
      case 'Loan':
        return <Home className="h-4 w-4" />;
      default:
        return <PiggyBank className="h-4 w-4" />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      'Checking': "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      'Savings': "bg-green-100 text-green-800 hover:bg-green-100/80",
      'Investment': "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
      'Credit Card': "bg-red-100 text-red-800 hover:bg-red-100/80",
      'Loan': "bg-amber-100 text-amber-800 hover:bg-amber-100/80",
      'Mortgage': "bg-orange-100 text-orange-800 hover:bg-orange-100/80",
      'Retirement': "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
      'Other': "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
    };
    
    return typeColors[type] || "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId && onDelete) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  // Group accounts by type
  const groupedAccounts = accounts.reduce((groups, account) => {
    const group = groups[account.type] || [];
    group.push(account);
    groups[account.type] = group;
    return groups;
  }, {} as Record<string, FinancialAccount[]>);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedAccounts).map(([type, accountsOfType]) => (
            <TableRow key={type} className="bg-muted/20">
              <TableCell colSpan={6} className="font-medium py-2">
                {type}
              </TableCell>
            </TableRow>
          )).concat(
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getAccountIcon(account.type)}
                    {account.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getAccountTypeColor(account.type)}>
                    {account.type}
                  </Badge>
                </TableCell>
                <TableCell>{account.institution || '—'}</TableCell>
                <TableCell className={`text-right ${account.isAsset ? 'text-green-600' : 'text-red-600'}`}>
                  {account.currency}
                  {Math.abs(account.balance).toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-gray-500">
                  {format(new Date(account.lastUpdated), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                        onClick={() => onEdit(account)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}
                    
                    {onDelete && (
                      <AlertDialog open={deletingId === account.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            onClick={() => handleDeleteClick(account.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this account? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={confirmDelete}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccountList;
