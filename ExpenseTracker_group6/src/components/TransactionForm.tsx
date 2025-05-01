
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Category, PaymentMethod, Currency, Transaction } from "@/types";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MOCK_USER_ID, categorizeTransaction } from "@/lib/mockData";

// Define categories and payment methods
const categories: Category[] = [
  'Food', 
  'Transport', 
  'Entertainment', 
  'Shopping', 
  'Housing', 
  'Utilities', 
  'Health', 
  'Education', 
  'Personal', 
  'Other',
  'Income'
];

const paymentMethods: PaymentMethod[] = [
  'Cash', 
  'Credit Card', 
  'Debit Card', 
  'Bank Transfer', 
  'UPI', 
  'Other'
];

// Define available currencies
const currencies: { value: Currency | string; label: string }[] = [
  { value: '$', label: 'USD ($)' },
  { value: '€', label: 'EUR (€)' },
  { value: '£', label: 'GBP (£)' },
  { value: '¥', label: 'JPY (¥)' },
  { value: '₹', label: 'INR (₹)' },
  { value: '₩', label: 'KRW (₩)' },
  { value: '$', label: 'CAD ($)' },
  { value: '$', label: 'AUD ($)' }
];

// Form schema
const formSchema = z.object({
  description: z.string().min(3, { message: "Description must be at least 3 characters." }),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) !== 0, {
    message: "Amount must be a non-zero number."
  }),
  category: z.enum(['Food', 'Transport', 'Entertainment', 'Shopping', 
    'Housing', 'Utilities', 'Health', 'Education', 'Personal', 'Other', 'Income']),
  paymentMethod: z.enum(['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other']),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date."
  }),
  currency: z.string().default('$')
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onSubmit: (data: any) => void;
  initialValues?: Transaction;
  isEditing?: boolean;
}

const TransactionForm = ({ onSubmit, initialValues, isEditing = false }: TransactionFormProps) => {
  const defaultValues = {
    description: "",
    amount: "",
    category: "Other" as Category,
    paymentMethod: "Cash" as PaymentMethod,
    date: new Date().toISOString().split('T')[0],
    currency: "$"
  };

  // Prepare initial values for editing mode
  const getInitialValues = () => {
    if (!initialValues) return defaultValues;
    
    return {
      description: initialValues.description,
      // Convert to positive for form display
      amount: String(Math.abs(initialValues.amount)),
      category: initialValues.category,
      paymentMethod: initialValues.paymentMethod,
      date: new Date(initialValues.date).toISOString().split('T')[0],
      currency: initialValues.currency || "$"
    };
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
  });

  const [isIncome, setIsIncome] = useState(
    initialValues ? initialValues.category === 'Income' : false
  );

  // Update category automatically based on description
  const handleDescriptionChange = (value: string) => {
    if (isEditing) return; // Don't auto-categorize when editing
    
    const suggestedCategory = categorizeTransaction(value);
    form.setValue("category", suggestedCategory);
    
    // Update isIncome state to adjust the amount sign
    setIsIncome(suggestedCategory === 'Income');
  };

  const handleSubmit = (values: FormValues) => {
    // Format amount based on income/expense
    const numericAmount = Number(values.amount);
    const formattedAmount = isIncome ? Math.abs(numericAmount) : -Math.abs(numericAmount);
    
    // Create the transaction object
    const transaction = {
      date: new Date(values.date).toISOString(),
      description: values.description,
      amount: formattedAmount,
      category: values.category,
      paymentMethod: values.paymentMethod,
      currency: values.currency,
      ...(isEditing && initialValues ? { id: initialValues.id, userId: initialValues.userId } : { userId: MOCK_USER_ID })
    };
    
    onSubmit(transaction);
    
    if (!isEditing) {
      form.reset(defaultValues);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., Grocery shopping" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleDescriptionChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setIsIncome(value === 'Income');
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          {isEditing ? "Update Transaction" : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
