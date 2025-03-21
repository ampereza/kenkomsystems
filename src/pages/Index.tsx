import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package, TestTube2, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentsOverview } from "@/components/dashboard/DocumentsOverview";

const Index = () => {
  // Stock statistics
  const { data: stockStats } = useQuery({
    queryKey: ["stock-stats"],
    queryFn: async () => {
      // Fetch unsorted stock
      const { data: unsortedData, error: unsortedError } = await supabase
        .from("unsorted_stock")
        .select("quantity")
        .not("quantity", "eq", 0);
      
      if (unsortedError) {
        console.error("Error fetching unsorted stock:", unsortedError);
        throw unsortedError;
      }
      
      // Fetch sorted stock
      const { data: sortedData, error: sortedError } = await supabase
        .from("sorted_stock")
        .select("quantity")
        .not("quantity", "eq", 0)
        .not("category", "eq", "rejected");
      
      if (sortedError) {
        console.error("Error fetching sorted stock:", sortedError);
        throw sortedError;
      }
      
      // Fetch rejected stock
      const { data: rejectedData, error: rejectedError } = await supabase
        .from("sorted_stock")
        .select("quantity")
        .eq("category", "rejected")
        .not("quantity", "eq", 0);
      
      if (rejectedError) {
        console.error("Error fetching rejected stock:", rejectedError);
        throw rejectedError;
      }

      return {
        unsorted: unsortedData?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0,
        sorted: sortedData?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0,
        rejected: rejectedData?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0
      };
    },
    meta: {
      errorMessage: "Failed to fetch stock statistics"
    }
  });

  // Financial statistics
  const { data: financialStats } = useQuery({
    queryKey: ["financial-stats"],
    queryFn: async () => {
      // Get regular transactions
      console.log("Fetching financial stats...");
      const { data, error } = await supabase
        .from("transactions")
        .select("type, amount")
        .order("transaction_date", { ascending: false })
        .limit(100);
      
      if (error) {
        console.error("Error fetching financial stats:", error);
        throw error;
      }

      console.log("Transactions:", data);

      // Also fetch payment vouchers to include as expenses
      const { data: paymentVouchers, error: voucherError } = await supabase
        .from("payment_vouchers")
        .select("total_amount")
        .order("date", { ascending: false })
        .limit(100);
      
      if (voucherError) {
        console.error("Error fetching payment vouchers:", voucherError);
        throw voucherError;
      }
      
      console.log("Payment vouchers:", paymentVouchers);
      
      const income = data
        ?.filter(t => t.type === 'sale' || t.type === 'treatment_income')
        .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
      
      // Sum up regular expenses
      const transactionExpenses = data
        ?.filter(t => t.type === 'expense' || t.type === 'purchase' || t.type === 'salary')
        .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
      
      // Add payment voucher amounts to expenses
      const voucherExpenses = paymentVouchers
        ?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
      
      // Calculate total expenses
      const expenses = transactionExpenses + voucherExpenses;

      console.log("Income:", income);
      console.log("Transaction expenses:", transactionExpenses);
      console.log("Voucher expenses:", voucherExpenses);
      console.log("Total expenses:", expenses);

      return {
        income,
        expenses,
        net: income - expenses
      };
    },
    meta: {
      errorMessage: "Failed to fetch financial statistics"
    }
  });

  // Treatment statistics
  const { data: treatmentStats } = useQuery({
    queryKey: ["treatment-stats"],
    queryFn: async () => {
      // Use treatment_log table instead of treatments
      const { data, error } = await supabase
        .from("treatment_log")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) {
        console.error("Error fetching treatment stats:", error);
        throw error;
      }

      // Since we don't have a status column, we'll count all treatment logs as "completed"
      // and set others to 0 to avoid errors
      const total = data?.reduce((acc, curr) => acc + (curr.total_poles || 0), 0) || 0;

      return {
        pending: 0,
        inProgress: 0,
        completed: total,
        total: total
      };
    },
    meta: {
      errorMessage: "Failed to fetch treatment statistics"
    }
  });

  // Client statistics
  const { data: clientStats } = useQuery({
    queryKey: ["client-stats"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("clients")
        .select("*", { count: 'exact', head: true });
      
      if (error) {
        console.error("Error fetching client stats:", error);
        throw error;
      }

      return {
        total: count || 0
      };
    },
    meta: {
      errorMessage: "Failed to fetch client statistics"
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto p-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">System Overview</h1>
          <p className="mt-2 text-muted-foreground">
            Key performance indicators across all departments
          </p>
        </div>

        <div className="grid gap-6">
          {/* Financial Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${financialStats?.income.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-muted-foreground mt-1">Recent transactions</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${financialStats?.expenses.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-muted-foreground mt-1">Recent transactions</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${financialStats?.net.toFixed(2) || '0.00'}</div>
                  <div className={cn(
                    "flex items-center text-xs mt-1",
                    (financialStats?.net || 0) >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {(financialStats?.net || 0) >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    Recent performance
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Documents Overview Section */}
          <DocumentsOverview />

          {/* Stock Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Stock Management</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unsorted Stock</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockStats?.unsorted || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Poles awaiting sorting</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sorted Stock</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockStats?.sorted || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Poles ready for treatment</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected Poles</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stockStats?.rejected || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Poles marked as rejected</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Treatment Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Treatment Operations</h2>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Treatments</CardTitle>
                  <TestTube2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{treatmentStats?.total || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Poles in treatment system</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <TestTube2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{treatmentStats?.pending || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Awaiting treatment</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <TestTube2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{treatmentStats?.inProgress || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Currently being treated</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientStats?.total || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Registered clients</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
