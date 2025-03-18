
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialOverview, FinancialSummary, isFinancialOverview } from '@/types/FinancialSummary';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

const GeneralManagerDashboard = () => {
  const { toast } = useToast();
  const [financialData, setFinancialData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialOverview = async () => {
      try {
        setLoading(true);
        
        // Fetch financial overview data
        const { data, error } = await supabase
          .from('financial_summary')
          .select('*')
          .single();
        
        if (error) throw error;
        
        setFinancialData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialOverview();
  }, [toast]);

  // Create a safe accessor for financial data
  const getFinancialOverview = (): FinancialOverview => {
    if (financialData && isFinancialOverview(financialData)) {
      return financialData;
    }
    // Default values if data is not available or not the right type
    return {
      total_revenue: 0,
      total_expenses: 0,
      profit: 0,
      customer_count: 0
    };
  };

  const overview = getFinancialOverview();

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">General Manager Dashboard</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₦{overview.total_revenue.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₦{overview.total_expenses.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₦{overview.profit.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{overview.customer_count}</p>
                </CardContent>
              </Card>
            </div>

            {/* Placeholder for charts and other dashboard elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add your revenue chart component here */}
                  <p className="text-muted-foreground">Chart Placeholder</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Expenses Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add your expenses chart component here */}
                  <p className="text-muted-foreground">Chart Placeholder</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="operations">
            <Card>
              <CardHeader>
                <CardTitle>Operations Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add your operations overview content here */}
                <p className="text-muted-foreground">Operations content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Data</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add your financial data content here */}
                <p className="text-muted-foreground">Financial content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default GeneralManagerDashboard;
