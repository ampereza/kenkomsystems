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
import { StockNavbar } from "@/components/navigation/StockNavbar";
import { formatCurrency } from "@/components/finance/print-templates/BasePrintTemplate";

export default function SupplierReport() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const handleRangeSelect = (range: "day" | "week" | "month" | "year") => {
    const now = new Date();
    switch (range) {
      case "day":
        setDateRange({
          from: startOfDay(now),
          to: endOfDay(now)
        });
        break;
      case "week":
        setDateRange({
          from: startOfWeek(now),
          to: endOfWeek(now)
        });
        break;
      case "month":
        setDateRange({
          from: startOfMonth(now),
          to: endOfMonth(now)
        });
        break;
      case "year":
        setDateRange({
          from: startOfYear(now),
          to: endOfYear(now)
        });
        break;
    }
  };

  const { data: supplierTransactions, isLoading } = useQuery({
    queryKey: ["supplier-transactions", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supplier_transactions")
        .select("*")
        .gte("transaction_date", dateRange.from.toISOString())
        .lte("transaction_date", dateRange.to.toISOString())
        .order("transaction_date");

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <StockNavbar />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Supplier Transactions Report</h1>
        
        <DateRangeSelector
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRangeSelect={handleRangeSelect}
        />

        {isLoading ? (
          <div className="text-center py-8">Loading supplier data...</div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierTransactions?.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.supplier_name}</TableCell>
                        <TableCell className="capitalize">
                          {transaction.type.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>{transaction.reference_number}</TableCell>
                        <TableCell className="text-right">
                          ${Number(transaction.amount).toFixed(2)}
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
