
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialMetrics } from "@/components/reports/FinancialMetrics";
import { CircleDollarSign, TrendingUp, FileBarChart, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function MDDashboard() {
  const { data: financialSummary } = useQuery({
    queryKey: ["md-financial-summary"],
    queryFn: async () => {
      // Fetch regular financial summary data
      const { data, error } = await supabase
        .from("financial_summary")
        .select("*")
        .order("date", { ascending: false })
        .limit(30);

      if (error) throw error;
      
      // Also fetch recent payment vouchers
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: paymentVouchers, error: voucherError } = await supabase
        .from("payment_vouchers")
        .select("date, total_amount")
        .gte("date", thirtyDaysAgo.toISOString().split('T')[0])
        .order("date", { ascending: false });
      
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
        <h1 className="text-3xl font-bold mb-6">Managing Director's Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link to="/reports/financial">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Financial Report</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">View Details →</div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reports/stock">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Report</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">View Details →</div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reports/suppliers">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supplier Report</CardTitle>
                <FileBarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">View Details →</div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reports/employees">
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employee Report</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">View Details →</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="space-y-6">
          <FinancialMetrics totals={totals} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add KPIs here */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add business metrics here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
