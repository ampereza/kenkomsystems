
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Package, Users, TestTube2, CircleDollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { EmployeeManager } from "@/components/management/EmployeeManager";

export default function GeneralManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch financial summary for the dashboard
  const { data: financialSummary, isLoading: isFinancialLoading } = useQuery({
    queryKey: ["gm-financial-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_summary")
        .select("*")
        .order("date", { ascending: false })
        .limit(7);

      if (error) throw error;
      return data;
    },
  });

  // Fetch stock summary
  const { data: stockSummary, isLoading: isStockLoading } = useQuery({
    queryKey: ["stock-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sorted_stock")
        .select("category, SUM(quantity) as total_quantity")
        .gt("quantity", 0)
        .group("category");

      if (error) throw error;
      return data;
    },
  });

  // Calculate total stock
  const totalStock = stockSummary?.reduce((sum, item) => sum + parseInt(item.total_quantity), 0) || 0;

  // Fetch treatment summary
  const { data: treatmentSummary, isLoading: isTreatmentLoading } = useQuery({
    queryKey: ["treatment-summary"],
    queryFn: async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      
      const { data, error } = await supabase
        .from("treatment_log")
        .select("*")
        .gte("date", startOfDay)
        .lte("date", endOfDay);

      if (error) throw error;
      return data;
    },
  });

  // Fetch client count
  const { data: clientCount } = useQuery({
    queryKey: ["client-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  // Calculate today's revenue
  const todayRevenue = financialSummary
    ?.filter(item => 
      item.type === "sale" || 
      item.type === "treatment_income"
    )
    .reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">General Manager Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${isFinancialLoading ? "..." : todayRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStockLoading ? "..." : totalStock}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treatments Today</CardTitle>
              <TestTube2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isTreatmentLoading ? "..." : treatmentSummary?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Operations Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Total Stock</span>
                        <span className="text-xl font-bold">{totalStock} items</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Daily Treatments</span>
                        <span className="text-xl font-bold">{treatmentSummary?.length || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Active Clients</span>
                        <span className="text-xl font-bold">{clientCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Revenue Stream</span>
                        <span className="text-xl font-bold">Stable</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CircleDollarSign className="h-5 w-5 text-green-500 mr-2" />
                        <span>Today's Revenue</span>
                      </div>
                      <span className="font-bold">${todayRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CircleDollarSign className="h-5 w-5 text-amber-500 mr-2" />
                        <span>Pending Payments</span>
                      </div>
                      <span className="font-bold">$5,250.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CircleDollarSign className="h-5 w-5 text-red-500 mr-2" />
                        <span>Outstanding Costs</span>
                      </div>
                      <span className="font-bold">$3,450.00</span>
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

          {/* Stock Tab */}
          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Stock Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Stock management content will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Client management content will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Treatment Tab */}
          <TabsContent value="treatment">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Treatment operations content will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
