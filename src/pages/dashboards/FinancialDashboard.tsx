
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Calendar, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/FinancialSummary";

export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState<TransactionType>("sale");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      try {
        // Fetch regular financial summary data
        const { data, error } = await supabase
          .from("financial_summary")
          .select("*")
          .order("date", { ascending: false })
          .limit(30);

        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching financial summary:", error);
        return [];
      }
    },
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", activeTab],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("type", activeTab)
          .order("transaction_date", { ascending: sortOrder === "asc" })
          .limit(50);

        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error(`Error fetching ${activeTab} transactions:`, error);
        return [];
      }
    },
  });

  // Calculate financial summary totals
  const totals = {
    sales: financialSummary?.filter(item => item.type === "sale")
      .reduce((sum, item) => sum + Number(item.total_amount), 0) || 0,
    treatment: financialSummary?.filter(item => item.type === "treatment_income")
      .reduce((sum, item) => sum + Number(item.total_amount), 0) || 0,
    expense: financialSummary?.filter(item => item.type === "expense" || item.type === "office_expense")
      .reduce((sum, item) => sum + Number(item.total_amount), 0) || 0,
    purchases: financialSummary?.filter(item => item.type === "purchase")
      .reduce((sum, item) => sum + Number(item.total_amount), 0) || 0,
  };

  const totalNetIncome = totals.sales + totals.treatment - totals.expense - totals.purchases;

  // Function to toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Financial Management Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={toggleSortOrder}
            className="border-orange-400 text-orange-500 hover:bg-orange-50"
          >
            sort by: date <Calendar className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="border-orange-300 bg-orange-50/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">total sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totals.sales.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-orange-300 bg-orange-50/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">total treatment income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totals.treatment.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-orange-300 bg-orange-50/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">total expense</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totals.expense.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-orange-300 bg-orange-50/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">total purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totals.purchases.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-orange-300 bg-orange-50/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">net income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalNetIncome.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction Tab Section */}
        <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-200">
          <Tabs defaultValue="sale" value={activeTab} onValueChange={(value) => setActiveTab(value as TransactionType)}>
            <TabsList className="mb-4 bg-orange-100/80">
              <TabsTrigger 
                value="sale" 
                className={activeTab === "sale" ? "bg-orange-400 text-white" : "text-orange-600"}
              >
                sales
              </TabsTrigger>
              <TabsTrigger 
                value="treatment_income"
                className={activeTab === "treatment_income" ? "bg-orange-400 text-white" : "text-orange-600"}
              >
                treatment
              </TabsTrigger>
              <TabsTrigger 
                value="purchase"
                className={activeTab === "purchase" ? "bg-orange-400 text-white" : "text-orange-600"}
              >
                purchases
              </TabsTrigger>
              <TabsTrigger 
                value="expense"
                className={activeTab === "expense" ? "bg-orange-400 text-white" : "text-orange-600"}
              >
                expense
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="p-0">
              <div className="bg-orange-300 rounded-lg p-4">
                {isLoadingTransactions ? (
                  <div className="text-center py-8">Loading transactions...</div>
                ) : transactions && transactions.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-orange-400 text-white">
                      <TableRow>
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">Description</TableHead>
                        <TableHead className="text-white">Amount</TableHead>
                        <TableHead className="text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="bg-orange-200/80 hover:bg-orange-300/60">
                          <TableCell>
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.description || "No description"}</TableCell>
                          <TableCell className="font-medium">
                            ${Number(transaction.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-orange-800 bg-orange-200 rounded-lg">
                    No {activeTab.replace('_', ' ')} transactions found
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
