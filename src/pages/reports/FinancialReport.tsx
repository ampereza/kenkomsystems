
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay } from "date-fns";
import { exportToExcel } from "@/utils/exportUtils";
import { FinancialMetrics } from "@/components/reports/FinancialMetrics";
import { FinancialStatements } from "@/components/reports/FinancialStatements";
import { FinancialTrends } from "@/components/reports/FinancialTrends";
import { DetailedTransactions } from "@/components/reports/DetailedTransactions";
import { IncomeStatement } from "@/components/reports/IncomeStatement";
import type { DetailedIncomeStatement } from "@/components/reports/income-statement/types";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";

export default function FinancialReport() {
  const [startDate, setStartDate] = React.useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = React.useState(endOfMonth(new Date()));

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
      // Include payment vouchers explicitly in the query
      const { data, error } = await supabase
        .from("financial_summary")
        .select("*")
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .order("date");

      if (error) throw error;
      
      // Also fetch payment vouchers in the date range
      const { data: paymentVouchers, error: voucherError } = await supabase
        .from("payment_vouchers")
        .select("date, total_amount")
        .gte("date", startDate.toISOString().split('T')[0])
        .lte("date", endDate.toISOString().split('T')[0])
        .order("date");
      
      if (voucherError) {
        console.error("Error fetching payment vouchers:", voucherError);
      }
      
      // Combine the financial data with payment vouchers
      const combinedData = [...(data || [])];
      
      if (paymentVouchers) {
        // Group payment vouchers by date
        const vouchersByDate = paymentVouchers.reduce((acc, voucher) => {
          const dateStr = voucher.date.toString();
          if (!acc[dateStr]) {
            acc[dateStr] = {
              count: 0,
              total: 0
            };
          }
          acc[dateStr].count += 1;
          acc[dateStr].total += Number(voucher.total_amount);
          return acc;
        }, {} as Record<string, { count: number, total: number }>);
        
        // Add grouped vouchers to the combined data
        Object.entries(vouchersByDate).forEach(([date, { count, total }]) => {
          combinedData.push({
            date: new Date(date).toISOString(),
            type: "expense",
            transaction_count: count,
            total_amount: total
          });
        });
      }
      
      return combinedData;
    },
  });

  const { data: incomeStatement } = useQuery({
    queryKey: ["income-statement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income_statement")
        .select("*");

      if (error) throw error;
      return data as DetailedIncomeStatement[];
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

  const handleExportBalanceSheet = () => {
    // This function will be passed to FinancialStatements component
    const balanceSheetData = document.querySelectorAll('[data-export-balance-sheet="true"]');
    if (balanceSheetData) {
      const data = Array.from(balanceSheetData).map(row => ({
        account_code: row.getAttribute('data-account-code'),
        account_name: row.getAttribute('data-account-name'),
        account_type: row.getAttribute('data-account-type'),
        balance: row.getAttribute('data-balance')
      }));
      exportToExcel(data, `balance-sheet-${new Date().toISOString().split('T')[0]}`);
    }
  };

  const handleExportIncomeStatement = () => {
    if (!incomeStatement) return;
    exportToExcel(incomeStatement, `income-statement-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <>
      <FinancialNavbar />
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
            <FinancialMetrics totals={totals} />
            
            <IncomeStatement />
            
            <FinancialStatements
              /* Remove the balanceSheet prop since it's now fetched inside the component */
              incomeStatement={incomeStatement}
              onExportBalanceSheet={handleExportBalanceSheet}
              onExportIncomeStatement={handleExportIncomeStatement}
            />
            
            <FinancialTrends chartData={chartData} />
            
            <DetailedTransactions transactions={financialData} />
          </div>
        )}
      </div>
    </>
  );
}
