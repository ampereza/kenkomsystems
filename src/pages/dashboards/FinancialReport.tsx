
import React from 'react';
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialMetrics } from "@/components/reports/FinancialMetrics";
import { IncomeStatement } from "@/components/reports/IncomeStatement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function FinancialReport() {
  const { data: financialSummary } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_summary")
        .select("*")
        .order("date", { ascending: false })
        .limit(60); // Get more data for the report

      if (error) throw error;
      return data;
    },
  });

  const totals = financialSummary?.reduce(
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

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Financial Report</h1>
        <p className="text-gray-600 mb-8">
          Comprehensive financial report showing detailed financial metrics, income statements, and analysis.
        </p>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialMetrics totals={totals} />
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Income Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeStatement />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
