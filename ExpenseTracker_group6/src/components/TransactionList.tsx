
import { Transaction } from "@/types";
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
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
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
import { useState } from "react";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      Food: "bg-amber-100 text-amber-800 hover:bg-amber-100/80",
      Transport: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      Entertainment: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
      Shopping: "bg-pink-100 text-pink-800 hover:bg-pink-100/80",
      Housing: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
      Utilities: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
      Health: "bg-red-100 text-red-800 hover:bg-red-100/80",
      Education: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80",
      Personal: "bg-orange-100 text-orange-800 hover:bg-orange-100/80",
      Other: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
      Income: "bg-green-100 text-green-800 hover:bg-green-100/80",
    };
    
    return categoryColors[category] || "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                  {transaction.category}
                </Badge>
              </TableCell>
              <TableCell className={`text-right ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount >= 0 ? '+' : ''}
                {transaction.currency || '$'}
                {Math.abs(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                      onClick={() => onEdit(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  
                  {onDelete && (
                    <AlertDialog open={deletingId === transaction.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          onClick={() => handleDeleteClick(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this transaction? This action cannot be undone.
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
