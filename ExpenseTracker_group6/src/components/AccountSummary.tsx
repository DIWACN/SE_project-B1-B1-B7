
import { FinancialAccount } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpFromLine, ArrowDownToLine, DollarSign } from 'lucide-react';

interface AccountSummaryProps {
  accounts: FinancialAccount[];
  currency?: string;
}

const AccountSummary = ({ accounts, currency = '$' }: AccountSummaryProps) => {
  // Calculate totals
  const totalAssets = accounts
    .filter(account => account.isAsset)
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalLiabilities = accounts
    .filter(account => !account.isAsset)
    .reduce((sum, account) => sum + account.balance, 0);
    
  const netWorth = totalAssets - totalLiabilities;

  // Calculate by account type
  const calculateTotalByType = (type: string) => {
    return accounts
      .filter(account => account.type === type)
      .reduce((sum, account) => sum + (account.isAsset ? account.balance : -account.balance), 0);
  };

  const checkingSavingsTotal = calculateTotalByType('Checking') + calculateTotalByType('Savings');
  const investmentsTotal = calculateTotalByType('Investment') + calculateTotalByType('Retirement');
  const debtTotal = Math.abs(calculateTotalByType('Credit Card') + calculateTotalByType('Loan') + calculateTotalByType('Mortgage'));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-purple-50 to-white">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">Net Worth</h3>
            <p className={`text-3xl font-bold mt-2 ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currency}{Math.abs(netWorth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <ArrowUpFromLine className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Total Assets</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">
              {currency}{totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <ArrowDownToLine className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Total Liabilities</h3>
            <p className="text-2xl font-bold mt-2 text-red-600">
              {currency}{totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 pb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Quick Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Checking & Savings</span>
              <span className="font-medium">{currency}{checkingSavingsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Investments</span>
              <span className="font-medium">{currency}{investmentsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Debt</span>
              <span className="font-medium text-red-600">{currency}{debtTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSummary;
