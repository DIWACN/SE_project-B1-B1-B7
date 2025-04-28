
import { mockFinancialTips } from "@/lib/mockData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinancialTips = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockFinancialTips.map((tip) => (
          <Card key={tip.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {tip.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={tip.imageUrl}
                      alt={tip.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                )}
                <div>
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2 bg-purple-50 text-purple-700 hover:bg-purple-50/80">
                      {tip.category}
                    </Badge>
                    <h4 className="font-medium text-lg">{tip.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{tip.content}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="ml-auto">
                Read more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialTips;
