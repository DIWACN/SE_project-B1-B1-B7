
import { mockBudgets } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const BudgetOverview = () => {
  const sortedBudgets = [...mockBudgets].sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit));

  return (
    <div className="space-y-6">
      {sortedBudgets.map((budget) => {
        const percentage = (budget.spent / budget.limit) * 100;
        let statusColor = "bg-green-500";
        
        if (percentage >= 90) {
          statusColor = "bg-red-500";
        } else if (percentage >= 75) {
          statusColor = "bg-orange-500";
        } else if (percentage >= 50) {
          statusColor = "bg-yellow-500";
        }
        
        return (
          <Card key={budget.category}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium">{budget.category}</h3>
                  <p className="text-sm text-gray-500">
                    ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                  </p>
                </div>
                <span 
                  className={`text-sm font-medium ${percentage >= 90 ? 'text-red-500' : 
                    percentage >= 75 ? 'text-orange-500' : 
                    percentage >= 50 ? 'text-yellow-500' : 
                    'text-green-500'}`}
                >
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${statusColor}`}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BudgetOverview;
