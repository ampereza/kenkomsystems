
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BanknoteIcon } from "lucide-react";

interface FinancialMetricsProps {
  totals: {
    income: number;
    expenses: number;
  } | undefined;
}

export function FinancialMetrics({ totals }: FinancialMetricsProps) {
  const income = totals?.income || 0;
  const expenses = totals?.expenses || 0;
  const netIncome = income - expenses;
  
  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatUGX(income)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatUGX(expenses)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netIncome < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatUGX(netIncome)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
