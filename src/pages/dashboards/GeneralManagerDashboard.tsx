
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialTrends } from "@/components/reports/FinancialTrends";
import { DetailedTransactions } from "@/components/reports/DetailedTransactions";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";

export default function GeneralManagerDashboard() {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  // Fetch financial summary data
  const { data: financialData } = useQuery({
    queryKey: ["financial-summary", dateRange],
    queryFn: async () => {
      // Format dates for Supabase query
      const startDate = dateRange.start.toISOString();
      const endDate = dateRange.end.toISOString();

      // Instead of using group, use our view that already has aggregated data
      const { data, error } = await supabase
        .from("financial_summary")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate);

      if (error) throw error;
      return data || [];
    },
  });

  // Calculate totals from the financial data
  const totalRevenue = financialData
    ? financialData
        .filter((item) => item.type === "sale" || item.type === "treatment_income")
        .reduce((sum, item) => sum + Number(item.total_amount || 0), 0)
    : 0;

  const totalExpenses = financialData
    ? financialData
        .filter((item) => 
          item.type === "purchase" || 
          item.type === "expense" || 
          item.type === "salary")
        .reduce((sum, item) => sum + Number(item.total_amount || 0), 0)
    : 0;

  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">General Manager Dashboard</h1>
        
        <DateRangeSelector 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange} 
        />
        
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                For the selected period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                For the selected period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                For the selected period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Profit Margin
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profitMargin.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">
                For the selected period
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Financial Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialTrends dateRange={dateRange} />
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailedTransactions dateRange={dateRange} limit={5} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
