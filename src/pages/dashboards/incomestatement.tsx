
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface IncomeSummary {
  total_revenue: number;
  total_expenses: number;
  net_income: number;
}

interface IncomeDetail {
  date: string;
  description: string;
  amount: number;
  type: string;
}

const IncomeStatementPage = () => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<IncomeSummary | null>(null);
  const [detailed, setDetailed] = useState<IncomeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("summary");

  useEffect(() => {
    const fetchIncomeStatementData = async () => {
      setLoading(true);
      try {
        // Fetch transactions for revenue
        const { data: revenueTransactions, error: revenueError } = await supabase
          .from("transactions")
          .select("*")
          .in("type", ["sale", "treatment_income"]);

        if (revenueError) throw revenueError;

        // Fetch transactions for expenses
        const { data: expenseTransactions, error: expenseError } = await supabase
          .from("transactions")
          .select("*")
          .in("type", ["expense", "salary"]);

        if (expenseError) throw expenseError;

        // Also fetch payment vouchers as expenses
        const { data: paymentVouchers, error: voucherError } = await supabase
          .from("payment_vouchers")
          .select("date, voucher_number, paid_to, total_amount");
          
        if (voucherError) throw voucherError;
        
        // Also fetch receipts as revenue
        const { data: receipts, error: receiptError } = await supabase
          .from("receipts")
          .select("date, receipt_number, received_from, amount");
          
        if (receiptError) throw receiptError;

        // Calculate totals
        const totalRevenue = 
          (revenueTransactions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0) +
          (receipts?.reduce((sum, item) => sum + Number(item.amount), 0) || 0);
          
        const totalExpenses = 
          (expenseTransactions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0) +
          (paymentVouchers?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0);
          
        const netIncome = totalRevenue - totalExpenses;

        // Create summary
        setSummary({
          total_revenue: totalRevenue,
          total_expenses: totalExpenses,
          net_income: netIncome
        });

        // Create detailed view
        const detailedItems: IncomeDetail[] = [
          // Add revenue transactions
          ...(revenueTransactions?.map(t => ({
            date: t.transaction_date || t.created_at,
            description: t.description || 'Revenue',
            amount: Number(t.amount),
            type: 'Revenue'
          })) || []),
          
          // Add expense transactions
          ...(expenseTransactions?.map(t => ({
            date: t.transaction_date || t.created_at,
            description: t.description || 'Expense',
            amount: Number(t.amount),
            type: 'Expense'
          })) || []),
          
          // Add payment vouchers as expenses
          ...(paymentVouchers?.map(v => ({
            date: v.date,
            description: `Payment to ${v.paid_to} (Voucher #${v.voucher_number})`,
            amount: Number(v.total_amount),
            type: 'Expense'
          })) || []),
          
          // Add receipts as revenue
          ...(receipts?.map(r => ({
            date: r.date,
            description: `Receipt from ${r.received_from} (Receipt #${r.receipt_number})`,
            amount: Number(r.amount),
            type: 'Revenue'
          })) || [])
        ];

        // Sort by date, most recent first
        detailedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setDetailed(detailedItems);
      } catch (error) {
        console.error("Error fetching income statement data:", error);
        toast({
          variant: "destructive",
          title: "Failed to load income statement",
          description: "There was an error loading the income statement data."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeStatementData();
  }, [toast]);

  return (
    <>
      <FinancialNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Income Statement</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading income statement data...</p>
          </div>
        ) : (
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              {/* Summary Card */}
              {summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Income Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Revenue</TableCell>
                          <TableCell className="text-right text-green-600">
                            ${summary.total_revenue.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Expenses</TableCell>
                          <TableCell className="text-right text-red-600">
                            ${summary.total_expenses.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="font-bold">
                          <TableCell>Net Income</TableCell>
                          <TableCell className={`text-right ${summary.net_income < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${summary.net_income.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="detailed">
              {/* Detailed Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Income Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailed.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>{entry.type}</TableCell>
                          <TableCell className={`text-right ${entry.type === 'Expense' ? 'text-red-600' : 'text-green-600'}`}>
                            ${entry.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {summary && (
                        <TableRow className="font-bold">
                          <TableCell colSpan={3}>Net Income</TableCell>
                          <TableCell className={`text-right ${summary.net_income < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${summary.net_income.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default IncomeStatementPage;
