
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialMetrics } from "@/components/reports/FinancialMetrics";
import { IncomeStatement } from "@/components/reports/IncomeStatement";
import { DocumentsOverview } from "@/components/dashboard/DocumentsOverview";
import { CircleDollarSign, ArrowUpDown, Receipt, Building2, Users, FileText, Briefcase, FileBarChart, CreditCard } from "lucide-react";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Link } from "react-router-dom";

export default function FinancialDashboard() {
  const { data: financialSummary } = useQuery({
    queryKey: ["financial-summary"],
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
    <>
      <FinancialNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Financial Management Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals?.income.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals?.expenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(totals ? totals.income - totals.expenses : 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"></div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Overview Section */}
        <div className="mb-6">
          <DocumentsOverview />
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Link to="/finance/transactions">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Manage all financial transactions</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/finance/expenses">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Track and manage company expenses</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/finance/employees">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Employee payroll and management</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/suppliers/view-suppliers">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Manage supplier relationships</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/clients">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Client management and details</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/reports/general-ledger">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">General Ledger</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">View complete financial records</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Reports Section */}
        <h2 className="text-xl font-semibold mb-4">Financial Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link to="/reports/financial">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Financial Report</CardTitle>
                <FileBarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">View detailed financial reports</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/suppliers/supplier-report">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supplier Report</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Analyze supplier performance</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/reports/employees">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employee Report</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Employee performance metrics</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="space-y-6">
          <FinancialMetrics totals={totals} />
          <IncomeStatement />
        </div>
      </div>
    </>
  );
}
