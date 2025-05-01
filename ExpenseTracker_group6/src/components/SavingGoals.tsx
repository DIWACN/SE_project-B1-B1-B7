
import { mockSavingGoals } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";

const SavingGoals = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Saving Goals</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockSavingGoals.map((goal) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          
          let targetDate;
          if (goal.targetDate) {
            targetDate = new Date(goal.targetDate);
          }
          
          return (
            <Card key={goal.id}>
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-purple-100 rounded-full mr-4">
                    <Target className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{goal.name}</h4>
                    {targetDate && (
                      <p className="text-sm text-gray-500">
                        Target date: {targetDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>${goal.currentAmount.toFixed(2)}</span>
                    <span>${goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      ${remaining.toFixed(2)} remaining
                    </p>
                    <span className="text-sm font-medium">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  Add Funds
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SavingGoals;
