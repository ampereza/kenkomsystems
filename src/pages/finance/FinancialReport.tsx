
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { Account, DetailedIncomeStatement } from "@/components/reports/income-statement/types";
import { format } from "date-fns";

// Type definitions for balance sheet
interface BalanceSheetItem {
  category: string;
  description: string;
  amount: number;
}

const FinancialReport = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  // Function to format date for Supabase query
  const formatDateForQuery = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Query for balance sheet data
  const { data: balanceSheetData, isLoading: balanceSheetLoading } = useQuery({
    queryKey: ["balance-sheet", dateRange],
    queryFn: async () => {
      try {
        // Fetch transactions for assets (using purchase type as stand-in for assets)
        const { data: assetTransactions, error: assetError } = await supabase
          .from("transactions")
          .select("*")
          .eq("type", "purchase")
          .gte("transaction_date", formatDateForQuery(dateRange.from))
          .lte("transaction_date", formatDateForQuery(dateRange.to));

        if (assetError) throw assetError;

        // Fetch transactions for liabilities (using expense type as stand-in for liabilities)
        const { data: liabilityTransactions, error: liabilityError } = await supabase
          .from("transactions")
          .select("*")
          .eq("type", "expense")
          .gte("transaction_date", formatDateForQuery(dateRange.from))
          .lte("transaction_date", formatDateForQuery(dateRange.to));

        if (liabilityError) throw liabilityError;

        // Calculate totals
        const totalAssets = assetTransactions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const totalLiabilities = liabilityTransactions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const totalEquity = totalAssets - totalLiabilities;

        // Create detailed items
        const items: BalanceSheetItem[] = [
          ...assetTransactions?.map(t => ({
            category: 'Assets',
            description: t.description || 'Asset',
            amount: Number(t.amount)
          })) || [],
          ...liabilityTransactions?.map(t => ({
            category: 'Liabilities',
            description: t.description || 'Liability',
            amount: Number(t.amount)
          })) || [],
          {
            category: 'Equity',
            description: 'Calculated Equity',
            amount: totalEquity
          }
        ];

        return {
          summary: {
            total_assets: totalAssets,
            total_liabilities: totalLiabilities,
            total_equity: totalEquity
          },
          detailed: items
        };
      } catch (error) {
        console.error("Error fetching balance sheet data:", error);
        throw error;
      }
    }
  });

  // Query for income statement data
  const { data: incomeStatementData, isLoading: incomeStatementLoading } = useQuery({
    queryKey: ["income-statement", dateRange],
    queryFn: async () => {
      try {
        // Fetch transactions for revenue
        const { data: revenueTransactions, error: revenueError } = await supabase
          .from("transactions")
          .select("*")
          .in("type", ["sale", "treatment_income"])
          .gte("transaction_date", formatDateForQuery(dateRange.from))
          .lte("transaction_date", formatDateForQuery(dateRange.to));

        if (revenueError) throw revenueError;

        // Fetch transactions for expenses
        const { data: expenseTransactions, error: expenseError } = await supabase
          .from("transactions")
          .select("*")
          .in("type", ["expense", "salary"])
          .gte("transaction_date", formatDateForQuery(dateRange.from))
          .lte("transaction_date", formatDateForQuery(dateRange.to));

        if (expenseError) throw expenseError;

        // Calculate totals
        const totalRevenue = revenueTransactions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const totalExpenses = expenseTransactions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const netIncome = totalRevenue - totalExpenses;

        // Transform the data to match the DetailedIncomeStatement interface
        const detailedItems: DetailedIncomeStatement[] = [
          ...revenueTransactions?.map(t => ({
            entry_date: t.transaction_date || t.created_at,
            amount: Number(t.amount),
            account_code: "4000",
            account_name: "Revenue",
            account_type: "revenue",
            reference_number: t.reference_number || "",
            description: t.description || "Revenue transaction"
          })) || [],
          ...expenseTransactions?.map(t => ({
            entry_date: t.transaction_date || t.created_at,
            amount: Number(t.amount),
            account_code: "5000",
            account_name: "Expenses",
            account_type: "expense",
            reference_number: t.reference_number || "",
            description: t.description || "Expense transaction"
          })) || []
        ];

        // Sort by date
        detailedItems.sort((a, b) => 
          new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
        );

        return {
          summary: {
            total_revenue: totalRevenue,
            total_expenses: totalExpenses,
            net_income: netIncome
          },
          detailed: detailedItems
        };
      } catch (error) {
        console.error("Error fetching income statement data:", error);
        throw error;
      }
    }
  });

  // Query for chart of accounts (simplified for demo purposes)
  const { data: chartOfAccounts, isLoading: accountsLoading } = useQuery({
    queryKey: ["chart-of-accounts"],
    queryFn: async () => {
      try {
        // Fetch actual accounts from ledger_accounts
        const { data: accounts, error } = await supabase
          .from("ledger_accounts")
          .select("*");
          
        if (error) throw error;
        
        // If there are no accounts, create a demo set
        if (!accounts || accounts.length === 0) {
          const demoAccounts: Account[] = [
            { account_code: "1000", account_name: "Cash", account_type: "asset", balance: 5000 },
            { account_code: "1100", account_name: "Accounts Receivable", account_type: "asset", balance: 3000 },
            { account_code: "2000", account_name: "Accounts Payable", account_type: "liability", balance: 2000 },
            { account_code: "3000", account_name: "Owner's Equity", account_type: "equity", balance: 6000 },
            { account_code: "4000", account_name: "Revenue", account_type: "revenue", balance: 10000 },
            { account_code: "5000", account_name: "Expenses", account_type: "expense", balance: 4000 },
          ];
          return demoAccounts;
        }
        
        // Transform data into the Account interface
        return accounts.map(acct => ({
          account_code: acct.account_code || "",
          account_name: acct.account_name || "",
          account_type: acct.account_type || "",
          balance: 0 // We don't have balance in the database, so default to 0
        }));
      } catch (error) {
        console.error("Error fetching chart of accounts:", error);
        throw error;
      }
    }
  });

  const isLoading = balanceSheetLoading || incomeStatementLoading || accountsLoading;

  return (
    <>
      <FinancialNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Financial Reports</h1>
        
        <div className="mb-6">
          <DateRangeSelector 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading financial data...</p>
          </div>
        ) : (
          <Tabs defaultValue="income-statement">
            <TabsList className="mb-4">
              <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
              <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
              <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="income-statement">
              <Card>
                <CardHeader>
                  <CardTitle>Income Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium text-muted-foreground">Total Revenue</h3>
                      <p className="text-2xl font-bold text-green-600">
                        ${incomeStatementData?.summary.total_revenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium text-muted-foreground">Total Expenses</h3>
                      <p className="text-2xl font-bold text-red-600">
                        ${incomeStatementData?.summary.total_expenses.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium text-muted-foreground">Net Income</h3>
                      <p className={`text-2xl font-bold ${incomeStatementData?.summary.net_income < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${incomeStatementData?.summary.net_income.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incomeStatementData?.detailed.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(item.entry_date).toLocaleDateString()}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.account_name}</TableCell>
                          <TableCell>{item.reference_number}</TableCell>
                          <TableCell className={`text-right ${item.account_type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                            ${Number(item.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell colSpan={4}>Net Income</TableCell>
                        <TableCell className={`text-right ${incomeStatementData?.summary.net_income < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${incomeStatementData?.summary.net_income.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="balance-sheet">
              <Card>
                <CardHeader>
                  <CardTitle>Balance Sheet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium text-muted-foreground">Total Assets</h3>
                      <p className="text-2xl font-bold">
                        ${balanceSheetData?.summary.total_assets.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium text-muted-foreground">Total Liabilities</h3>
                      <p className="text-2xl font-bold">
                        ${balanceSheetData?.summary.total_liabilities.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium text-muted-foreground">Total Equity</h3>
                      <p className={`text-2xl font-bold ${balanceSheetData?.summary.total_equity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${balanceSheetData?.summary.total_equity.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceSheetData?.detailed.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">
                            ${Number(item.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">
                          ${(balanceSheetData?.summary.total_assets || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chart-of-accounts">
              <Card>
                <CardHeader>
                  <CardTitle>Chart of Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Code</TableHead>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chartOfAccounts?.map((account, index) => (
                        <TableRow key={index}>
                          <TableCell>{account.account_code}</TableCell>
                          <TableCell>{account.account_name}</TableCell>
                          <TableCell className="capitalize">{account.account_type}</TableCell>
                          <TableCell className="text-right">
                            ${Number(account.balance).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
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

export default FinancialReport;
