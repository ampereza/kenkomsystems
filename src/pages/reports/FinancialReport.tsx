
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function FinancialReport() {
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  const handleRangeSelect = (range: "day" | "week" | "month" | "year") => {
    const now = new Date();
    switch (range) {
      case "day":
        setStartDate(startOfDay(now));
        setEndDate(endOfDay(now));
        break;
      case "week":
        setStartDate(startOfWeek(now));
        setEndDate(endOfWeek(now));
        break;
      case "month":
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      case "year":
        setStartDate(startOfYear(now));
        setEndDate(endOfYear(now));
        break;
    }
  };

  const { data: financialData, isLoading } = useQuery({
    queryKey: ["financial-summary", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_summary")
        .select("*")
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .order("date");

      if (error) throw error;
      return data;
    },
  });

  const totals = financialData?.reduce(
    (acc, curr) => {
      if (curr.type === "expense" || curr.type === "salary") {
        acc.expenses += Number(curr.total_amount);
      } else if (curr.type === "sale" || curr.type === "treatment_income") {
        acc.income += Number(curr.total_amount);
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  const chartData = financialData?.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    amount: Number(item.total_amount),
    type: item.type,
  }));

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Financial Report</h1>
      
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onRangeSelect={handleRangeSelect}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading financial data...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totals?.income.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totals?.expenses.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Income
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(totals ? totals.income - totals.expenses : 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      name="Amount"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Transaction Count</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialData?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(item.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="capitalize">{item.type}</TableCell>
                      <TableCell>{item.transaction_count}</TableCell>
                      <TableCell>${Number(item.total_amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
