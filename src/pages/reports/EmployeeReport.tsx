import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { formatCurrency } from "@/components/finance/print-templates/BasePrintTemplate";

export default function EmployeeReport() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const handleRangeSelect = (range: "day" | "week" | "month" | "year") => {
    const now = new Date();
    let from = dateRange.from;
    let to = dateRange.to;
    
    switch (range) {
      case "day":
        from = startOfDay(now);
        to = endOfDay(now);
        break;
      case "week":
        from = startOfWeek(now);
        to = endOfWeek(now);
        break;
      case "month":
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
      case "year":
        from = startOfYear(now);
        to = endOfYear(now);
        break;
    }

    setDateRange({ from, to });
  };

  const { data: employeePayments, isLoading } = useQuery({
    queryKey: ["employee-payments", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_payments")
        .select("*")
        .gte("payment_date", dateRange.from.toISOString())
        .lte("payment_date", dateRange.to.toISOString())
        .order("payment_date");

      if (error) throw error;
      return data;
    },
  });

  const totalPayments = employeePayments?.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  ) || 0;

  return (
    <>
      <FinancialNavbar />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Employee Payments Report</h1>
        
        <DateRangeSelector
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRangeSelect={handleRangeSelect}
        />

        {isLoading ? (
          <div className="text-center py-8">Loading employee data...</div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalPayments.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeePayments?.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{payment.employee_name}</TableCell>
                        <TableCell>{payment.position}</TableCell>
                        <TableCell>
                          {new Date(payment.payment_period_start).toLocaleDateString()} - {new Date(payment.payment_period_end).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(payment.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
