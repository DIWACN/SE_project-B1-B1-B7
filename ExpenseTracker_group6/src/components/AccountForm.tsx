
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AccountType, Currency, FinancialAccount } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const accountFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.enum([
    'Checking', 'Savings', 'Investment', 'Credit Card', 
    'Loan', 'Mortgage', 'Retirement', 'Other'
  ] as const),
  balance: z.coerce.number(),
  currency: z.string(),
  institution: z.string().optional(),
  interestRate: z.coerce.number().optional(),
  isAsset: z.boolean(),
  notes: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  onSubmit: (data: Partial<FinancialAccount>) => void;
  initialValues?: FinancialAccount;
  isEditing?: boolean;
}

const AccountForm = ({ onSubmit, initialValues, isEditing = false }: AccountFormProps) => {
  const defaultValues: Partial<AccountFormValues> = {
    name: initialValues?.name || '',
    type: initialValues?.type || 'Checking',
    balance: initialValues?.balance || 0,
    currency: initialValues?.currency || '$',
    institution: initialValues?.institution || '',
    interestRate: initialValues?.interestRate || 0,
    isAsset: initialValues?.isAsset !== undefined ? initialValues.isAsset : true,
    notes: initialValues?.notes || '',
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const handleSubmit = (data: AccountFormValues) => {
    onSubmit(data);
    if (!isEditing) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Primary Checking" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Checking">Checking</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Loan">Loan</SelectItem>
                    <SelectItem value="Mortgage">Mortgage</SelectItem>
                    <SelectItem value="Retirement">Retirement</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Balance</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                    <SelectItem value="$">USD ($)</SelectItem>
                    <SelectItem value="€">EUR (€)</SelectItem>
                    <SelectItem value="£">GBP (£)</SelectItem>
                    <SelectItem value="¥">JPY (¥)</SelectItem>
                    <SelectItem value="₹">INR (₹)</SelectItem>
                    <SelectItem value="₩">KRW (₩)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Chase Bank" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate % (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g. 2.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAsset"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Asset/Liability</FormLabel>
                  <FormDescription>
                    {field.value ? "This is an asset (adds to net worth)" : "This is a liability (reduces net worth)"}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Any additional information" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isEditing ? "Update Account" : "Add Account"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
