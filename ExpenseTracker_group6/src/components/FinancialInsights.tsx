
import { Transaction } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface FinancialInsightsProps {
  transactions: Transaction[];
}

const FinancialInsights = ({ transactions }: FinancialInsightsProps) => {
  // Find top expense category
  const getTopExpenseCategory = () => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        if (!expensesByCategory[t.category]) {
          expensesByCategory[t.category] = 0;
        }
        expensesByCategory[t.category] += Math.abs(t.amount);
      });
      
    if (Object.keys(expensesByCategory).length === 0) return null;
    
    const topCategory = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])[0];
      
    return {
      category: topCategory[0],
      amount: topCategory[1]
    };
  };
  
  // Calculate daily average spend
  const getDailyAverage = () => {
    if (transactions.length === 0) return 0;
    
    const expenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    // Get date range (in days)
    const dates = transactions.map(t => new Date(t.date).getTime());
    const oldestDate = Math.min(...dates);
    const newestDate = Math.max(...dates);
    const daysDiff = Math.max(1, Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24)));
    
    return expenses / daysDiff;
  };
  
  // Get unusual spending (transactions with amount significantly larger than average)
  const getUnusualSpending = () => {
    if (transactions.length < 3) return [];
    
    const expenses = transactions.filter(t => t.amount < 0);
    const avgExpense = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0) / expenses.length;
    const threshold = avgExpense * 2;
    
    return expenses
      .filter(t => Math.abs(t.amount) > threshold)
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 3);
  };
  
  const topExpense = getTopExpenseCategory();
  const dailyAverage = getDailyAverage();
  const unusualSpending = getUnusualSpending();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Financial Insights</h3>
        
        {topExpense && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-purple-100 mr-4">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Top Expense Category</h4>
                  <p className="text-sm text-gray-500">
                    Your highest spending is in <span className="font-medium">{topExpense.category}</span>, 
                    totaling <span className="font-medium">${topExpense.amount.toFixed(2)}</span>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-blue-100 mr-4">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Daily Average Spending</h4>
                <p className="text-sm text-gray-500">
                  You spend about <span className="font-medium">${dailyAverage.toFixed(2)}</span> per day.
                  {dailyAverage > 50 && " Consider where you might reduce daily expenses."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {unusualSpending.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-amber-100 mr-4">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium">Unusual Spending</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    The following transactions are higher than your typical spending:
                  </p>
                  <ul className="space-y-1 text-sm">
                    {unusualSpending.map(t => (
                      <li key={t.id}>
                        <span className="font-medium">{t.description}</span>: ${Math.abs(t.amount).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FinancialInsights;
