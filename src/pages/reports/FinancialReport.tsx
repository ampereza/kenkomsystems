
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

  const { data: balanceSheet } = useQuery({
    queryKey: ["balance-sheet"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("balance_sheet")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const { data: incomeStatement } = useQuery({
    queryKey: ["income-statement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income_statement")
        .select("*");

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

  const handleExportBalanceSheet = () => {
    if (!balanceSheet) return;
    exportToExcel(balanceSheet, `balance-sheet-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportIncomeStatement = () => {
    if (!incomeStatement) return;
    exportToExcel(incomeStatement, `income-statement-${new Date().toISOString().split('T')[0]}`);
  };

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
          <FinancialMetrics totals={totals} />
          
          <IncomeStatement />
          
          <FinancialStatements
            balanceSheet={balanceSheet}
            incomeStatement={incomeStatement}
            onExportBalanceSheet={handleExportBalanceSheet}
            onExportIncomeStatement={handleExportIncomeStatement}
          />
          
          <FinancialTrends chartData={chartData} />
          
          <DetailedTransactions transactions={financialData} />
        </div>
      )}
    </div>
  );
}
