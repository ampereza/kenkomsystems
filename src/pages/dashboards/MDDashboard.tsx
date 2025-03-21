
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialMetrics } from "@/components/reports/FinancialMetrics";
import { CircleDollarSign, TrendingUp, FileBarChart, FileText, Users, Package, TestTube2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PricingManager } from "@/components/management/PricingManager";
import { EmployeeManager } from "@/components/management/EmployeeManager";
import { SupplierManager } from "@/components/management/SupplierManager";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MDDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
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

  // Recent transactions for overview
  const { data: recentTransactions } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("transaction_date", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  // Calculate totals for the dashboard cards
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
        <h1 className="text-3xl font-bold mb-6">Managing Director Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue (30d)</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals?.income.toFixed(2) || "0.00"}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses (30d)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals?.expenses.toFixed(2) || "0.00"}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit (30d)</CardTitle>
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${((totals?.income || 0) - (totals?.expenses || 0)).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/reports/financial">Financial Reports</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/reports/stock">Stock Reports</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <FinancialMetrics totals={totals} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTransactions?.length ? (
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium capitalize">
                              {transaction.type.replace("_", " ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.transaction_date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className={`font-medium ${
                            transaction.type === "sale" || transaction.type === "treatment_income" 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {transaction.type === "sale" || transaction.type === "treatment_income" ? "+" : "-"}
                            ${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent transactions</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium">Employees</span>
                      </div>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium">Stock Items</span>
                      </div>
                      <p className="text-2xl font-bold">324</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium">Clients</span>
                      </div>
                      <p className="text-2xl font-bold">28</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <TestTube2 className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium">Treatments</span>
                      </div>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button asChild>
                        <Link to="/reports/financial">View Financial Reports</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/dashboards/transactions">Transactions</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/dashboards/expenses">Expenses</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <EmployeeManager />
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <PricingManager />
          </TabsContent>

          {/* Stock Tab */}
          <TabsContent value="stock">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button asChild>
                        <Link to="/reports/stock">View Stock Reports</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/dashboards/stock">Stock Dashboard</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Suppliers Tab (formerly Treatment Tab) */}
          <TabsContent value="suppliers">
            <SupplierManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
