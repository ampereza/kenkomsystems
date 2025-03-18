
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users, LineChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DateRangeSelector, { DateRangeProps } from "@/components/reports/DateRangeSelector";
import FinancialTrends from "@/components/reports/FinancialTrends";
import DetailedTransactions from "@/components/reports/DetailedTransactions";

// Function to get current month range
const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: firstDay, to: lastDay };
};

export default function GeneralManagerDashboard() {
  // State for date range
  const [dateRange, setDateRange] = useState<DateRangeProps>(getCurrentMonthRange());

  // Handle date range change
  const handleDateRangeChange = (newRange: DateRangeProps) => {
    setDateRange(newRange);
  };

  // Fetch financial summary
  const { data: financialSummary, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ["financial-summary", dateRange.from, dateRange.to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_summary")
        .select("*")
        .single();

      if (error) throw error;
      return data || { 
        total_revenue: 0, 
        total_expenses: 0, 
        profit: 0, 
        customer_count: 0 
      };
    },
  });

  // Fallback values when loading
  const revenue = isLoadingFinancial ? 0 : financialSummary?.total_revenue || 0;
  const expenses = isLoadingFinancial ? 0 : financialSummary?.total_expenses || 0;
  const profit = isLoadingFinancial ? 0 : financialSummary?.profit || 0;
  const customers = isLoadingFinancial ? 0 : financialSummary?.customer_count || 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">General Manager Dashboard</h1>

      <div className="mb-6">
        <DateRangeSelector 
          dateRange={dateRange} 
          onDateRangeChange={handleDateRangeChange} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For current period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${expenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For current period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${profit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For current period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers}</div>
            <p className="text-xs text-muted-foreground">Total active customers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FinancialTrends from={dateRange.from} to={dateRange.to} />
        <DetailedTransactions from={dateRange.from} to={dateRange.to} limit={5} />
      </div>
    </div>
  );
}
