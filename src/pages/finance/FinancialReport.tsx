
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Balance, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { DetailedIncomeStatement, Account } from "@/components/reports/income-statement/types";

export default function FinancialReport() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  
  const [activeTab, setActiveTab] = useState("summary");
  const [financialData, setFinancialData] = useState<{
    income: number;
    expenses: number;
    profit: number;
    assets: number;
    liabilities: number;
    equity: number;
    transactions: any[];
    detailedIncomeStatement: DetailedIncomeStatement[];
    accounts: Account[];
  }>({
    income: 0,
    expenses: 0,
    profit: 0,
    assets: 0,
    liabilities: 0,
    equity: 0,
    transactions: [],
    detailedIncomeStatement: [],
    accounts: [],
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Fetch transactions for the date range
        const { data: transactions, error: transactionsError } = await supabase
          .from("transactions")
          .select("*")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString());

        if (transactionsError) throw transactionsError;

        // Calculate financial metrics from transactions
        let income = 0;
        let expenses = 0;
        let assets = 0;
        let liabilities = 0;

        transactions?.forEach((transaction) => {
          if (transaction.type === "sale" || transaction.type === "treatment_income") {
            income += transaction.amount;
          } else if (
            transaction.type === "purchase" ||
            transaction.type === "expense" ||
            transaction.type === "salary"
          ) {
            expenses += transaction.amount;
          }

          // For demo purposes - using transaction types to represent balance sheet data
          if (transaction.type === "purchase") {
            assets += transaction.amount;
          } else if (transaction.type === "expense") {
            liabilities += transaction.amount;
          }
        });

        // Calculate profit and equity
        const profit = income - expenses;
        const equity = assets - liabilities;

        // Create detailed income statement data (simplified for demo)
        const detailedIncomeStatement: DetailedIncomeStatement[] = [
          {
            account_code: "4000",
            account_name: "Sales Revenue",
            account_type: "income",
            entry_date: new Date().toISOString(),
            amount: income,
            description: "Total sales revenue",
            balance: income,
          },
          {
            account_code: "5000",
            account_name: "Cost of Goods Sold",
            account_type: "expense",
            entry_date: new Date().toISOString(),
            amount: expenses * 0.6,
            description: "Cost of goods sold",
            balance: expenses * 0.6,
          },
          {
            account_code: "6000",
            account_name: "Operating Expenses",
            account_type: "expense",
            entry_date: new Date().toISOString(),
            amount: expenses * 0.4,
            description: "Operating expenses",
            balance: expenses * 0.4,
          },
        ];

        // Create accounts data for balance sheet (simplified for demo)
        const accounts: Account[] = [
          {
            account_code: "1000",
            account_name: "Cash",
            account_type: "asset",
            balance: assets * 0.3,
          },
          {
            account_code: "1100",
            account_name: "Accounts Receivable",
            account_type: "asset",
            balance: assets * 0.2,
          },
          {
            account_code: "1200",
            account_name: "Inventory",
            account_type: "asset",
            balance: assets * 0.5,
          },
          {
            account_code: "2000",
            account_name: "Accounts Payable",
            account_type: "liability",
            balance: liabilities * 0.7,
          },
          {
            account_code: "2100",
            account_name: "Loans Payable",
            account_type: "liability",
            balance: liabilities * 0.3,
          },
          {
            account_code: "3000",
            account_name: "Owner's Equity",
            account_type: "equity",
            balance: equity,
          },
        ];

        setFinancialData({
          income,
          expenses,
          profit,
          assets,
          liabilities,
          equity,
          transactions: transactions || [],
          detailedIncomeStatement,
          accounts,
        });
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchFinancialData();
  }, [dateRange]);

  return (
    <div className="min-h-screen flex flex-col">
      <FinancialNavbar />
      <main className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Financial Report</h1>
        
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${financialData.income.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${financialData.expenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profit/Loss
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                financialData.profit >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                ${financialData.profit.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Assets
              </CardTitle>
              <Balance className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(financialData.assets - financialData.liabilities).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="income">Income Statement</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  Summary of financial performance for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Summary content here */}
                  <p>This is a simplified financial summary for demonstration purposes.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="income" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Income Statement</CardTitle>
                <CardDescription>
                  Revenue and expenses for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Income statement content here */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Account</th>
                          <th className="text-right py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialData.detailedIncomeStatement.map((entry) => (
                          <tr key={entry.account_code} className="border-b">
                            <td className="py-2">
                              {entry.account_name}
                              <div className="text-xs text-muted-foreground">{entry.description}</div>
                            </td>
                            <td className={`py-2 text-right ${
                              entry.account_type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ${entry.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-bold">
                          <td className="py-2">Net Income</td>
                          <td className={`py-2 text-right ${
                            financialData.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${financialData.profit.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="balance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>
                  Assets, liabilities, and equity as of {format(dateRange.to, "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Balance sheet content here */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Assets</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody>
                          {financialData.accounts
                            .filter((account) => account.account_type === 'asset')
                            .map((account) => (
                              <tr key={account.account_code} className="border-b">
                                <td className="py-2">{account.account_name}</td>
                                <td className="py-2 text-right">${account.balance.toLocaleString()}</td>
                              </tr>
                            ))}
                          <tr className="font-bold">
                            <td className="py-2">Total Assets</td>
                            <td className="py-2 text-right">${financialData.assets.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Liabilities</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody>
                          {financialData.accounts
                            .filter((account) => account.account_type === 'liability')
                            .map((account) => (
                              <tr key={account.account_code} className="border-b">
                                <td className="py-2">{account.account_name}</td>
                                <td className="py-2 text-right">${account.balance.toLocaleString()}</td>
                              </tr>
                            ))}
                          <tr className="font-bold">
                            <td className="py-2">Total Liabilities</td>
                            <td className="py-2 text-right">${financialData.liabilities.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Equity</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody>
                          {financialData.accounts
                            .filter((account) => account.account_type === 'equity')
                            .map((account) => (
                              <tr key={account.account_code} className="border-b">
                                <td className="py-2">{account.account_name}</td>
                                <td className="py-2 text-right">${account.balance.toLocaleString()}</td>
                              </tr>
                            ))}
                          <tr className="font-bold">
                            <td className="py-2">Total Equity</td>
                            <td className="py-2 text-right">${financialData.equity.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
