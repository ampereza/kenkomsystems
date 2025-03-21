
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Droplet, 
  DollarSign, 
  ShoppingBag, 
  ArrowUpDown,
  Calendar, 
  FileText, 
  Eye, 
  Edit,
  ArrowUpDown as Sort
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function FinancialOverview() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sales");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch financial summary data
  const { data: financialSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_summary")
        .select("*")
        .order("date", { ascending: false })
        .limit(60);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching financial summary",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  // Fetch transactions based on active tab
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", activeTab],
    queryFn: async () => {
      let query = supabase.from("transactions").select("*");
      
      // Filter by transaction type
      if (activeTab === "sales") {
        query = query.eq("type", "sale");
      } else if (activeTab === "treatment") {
        query = query.eq("type", "treatment_income");
      } else if (activeTab === "purchases") {
        query = query.eq("type", "purchase");
      } else if (activeTab === "expense") {
        query = query.eq("type", "expense");
      }
      
      // Apply sorting
      query = query.order("transaction_date", { ascending: sortOrder === "asc" });
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching transactions",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
  });

  // Fetch receipts data
  const { data: receipts } = useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Calculate summary totals
  const summaryTotals = financialSummary?.reduce(
    (acc, curr) => {
      if (curr.type === "sale") {
        acc.sales += Number(curr.total_amount);
      } else if (curr.type === "treatment_income") {
        acc.treatmentIncome += Number(curr.total_amount);
      } else if (curr.type === "expense" || curr.type === "salary") {
        acc.expenses += Number(curr.total_amount);
      } else if (curr.type === "purchase") {
        acc.purchases += Number(curr.total_amount);
      }
      return acc;
    },
    { sales: 0, treatmentIncome: 0, expenses: 0, purchases: 0 }
  ) || { sales: 0, treatmentIncome: 0, expenses: 0, purchases: 0 };

  // Calculate net income
  const netIncome = 
    summaryTotals.sales + 
    summaryTotals.treatmentIncome - 
    summaryTotals.expenses - 
    summaryTotals.purchases;

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getReceiptForTransaction = (transactionId: string) => {
    return receipts?.find(receipt => receipt.transaction_id === transactionId);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Financial summary boxes */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <Button
            variant="outline"
            onClick={toggleSortOrder}
            className="flex items-center gap-2"
          >
            <Sort className="h-4 w-4" />
            Sort by: date {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-orange-50 border-orange-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Total Sales</p>
                  <p className="text-xl font-bold">{formatCurrency(summaryTotals.sales)}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Treatment Income</p>
                  <p className="text-xl font-bold">{formatCurrency(summaryTotals.treatmentIncome)}</p>
                </div>
                <Droplet className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Total Expenses</p>
                  <p className="text-xl font-bold">{formatCurrency(summaryTotals.expenses)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Total Purchases</p>
                  <p className="text-xl font-bold">{formatCurrency(summaryTotals.purchases)}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${netIncome >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Net Income</p>
                  <p className={`text-xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netIncome)}
                  </p>
                </div>
                <ArrowUpDown className={`h-8 w-8 ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction tabs and table */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="bg-white rounded-lg border p-4"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="sales" className={activeTab === 'sales' ? 'bg-orange-100' : ''}>Sales</TabsTrigger>
            <TabsTrigger value="treatment" className={activeTab === 'treatment' ? 'bg-blue-100' : ''}>Treatment</TabsTrigger>
            <TabsTrigger value="purchases" className={activeTab === 'purchases' ? 'bg-purple-100' : ''}>Purchases</TabsTrigger>
            <TabsTrigger value="expense" className={activeTab === 'expense' ? 'bg-red-100' : ''}>Expense</TabsTrigger>
          </TabsList>

          {/* Table for all tabs */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>View Receipt</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(transaction.transaction_date), "dd MMM yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {transaction.description || `${transaction.type} transaction`}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(Number(transaction.amount))}
                      </TableCell>
                      <TableCell>
                        {getReceiptForTransaction(transaction.id) ? (
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">No receipt</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No {activeTab} transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
