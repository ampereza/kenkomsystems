
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StockReport() {
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

  const { data: stockData, isLoading } = useQuery({
    queryKey: ["stock-movements", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_movements")
        .select("*")
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .order("date");

      if (error) throw error;
      return data;
    },
  });

  const chartData = stockData?.reduce((acc: any[], curr) => {
    const existingDate = acc.find(
      (item) => item.date === new Date(curr.date).toLocaleDateString()
    );
    if (existingDate) {
      existingDate[curr.category] = (existingDate[curr.category] || 0) + curr.total_quantity;
    } else {
      acc.push({
        date: new Date(curr.date).toLocaleDateString(),
        [curr.category]: curr.total_quantity,
      });
    }
    return acc;
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Stock Movement Report</h1>
      
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onRangeSelect={handleRangeSelect}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading stock data...</div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fencing" fill="#8884d8" name="Fencing" />
                    <Bar dataKey="telecom" fill="#82ca9d" name="Telecom" />
                    <Bar dataKey="distribution" fill="#ffc658" name="Distribution" />
                    <Bar dataKey="high_voltage" fill="#ff7300" name="High Voltage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(item.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {item.category.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="capitalize">
                        {item.size}
                      </TableCell>
                      <TableCell>{item.total_quantity}</TableCell>
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
