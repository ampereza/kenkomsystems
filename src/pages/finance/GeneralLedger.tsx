import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
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

export default function GeneralLedger() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const handleRangeSelect = () => {
    // Implement range selection logic if needed
  };

  const { data: ledgerData, isLoading } = useQuery({
    queryKey: ["general-ledger", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
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
      <FinancialNavbar />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">General Ledger</h1>
        
        <DateRangeSelector
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRangeSelect={handleRangeSelect}
        />

        {isLoading ? (
          <div className="text-center py-8">Loading ledger data...</div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledgerData?.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="capitalize">
                          {transaction.type.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(transaction.amount))}
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
