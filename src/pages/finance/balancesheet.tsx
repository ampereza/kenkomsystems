
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";

interface BalanceSheetAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  subaccounts?: BalanceSheetAccount[];
}

export default function BalanceSheetPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1), // January 1st of current year
    to: new Date(),
  });
  
  const [assetAccounts, setAssetAccounts] = useState<BalanceSheetAccount[]>([]);
  const [liabilityAccounts, setLiabilityAccounts] = useState<BalanceSheetAccount[]>([]);
  const [equityAccounts, setEquityAccounts] = useState<BalanceSheetAccount[]>([]);
  
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [totalEquity, setTotalEquity] = useState(0);

  useEffect(() => {
    const fetchBalanceSheetData = async () => {
      try {
        // Fetch transactions for asset calculation
        const { data: assetTransactions } = await supabase
          .from("transactions")
          .select("*")
          .in("type", ["purchase", "sale"])
          .lte("created_at", dateRange.to.toISOString());
          
        // Fetch transactions for liability calculation
        const { data: liabilityTransactions } = await supabase
          .from("transactions")
          .select("*")
          .in("type", ["expense", "salary"])
          .lte("created_at", dateRange.to.toISOString());
        
        // Calculate total assets based on transactions
        // This is simplified for demo purposes
        let assetTotal = 0;
        if (assetTransactions) {
          const assets: BalanceSheetAccount[] = [
            {
              id: "1",
              name: "Cash and Cash Equivalents",
              type: "asset",
              balance: 0,
              subaccounts: [
                { id: "1-1", name: "Cash", type: "asset", balance: 0 },
                { id: "1-2", name: "Bank Accounts", type: "asset", balance: 0 },
              ],
            },
            {
              id: "2",
              name: "Accounts Receivable",
              type: "asset",
              balance: 0,
            },
            {
              id: "3",
              name: "Inventory",
              type: "asset",
              balance: 0,
              subaccounts: [
                { id: "3-1", name: "Raw Materials", type: "asset", balance: 0 },
                { id: "3-2", name: "Work in Progress", type: "asset", balance: 0 },
                { id: "3-3", name: "Finished Goods", type: "asset", balance: 0 },
              ],
            },
            {
              id: "4",
              name: "Property and Equipment",
              type: "asset",
              balance: 0,
            },
          ];
          
          // Calculate asset balances from transactions
          let cashBalance = 0;
          let accountsReceivable = 0;
          let inventory = 0;
          let propertyEquipment = 0;
          
          assetTransactions.forEach(transaction => {
            if (transaction.type === "purchase") {
              inventory += transaction.amount * 0.6;
              propertyEquipment += transaction.amount * 0.4;
            } else if (transaction.type === "sale") {
              cashBalance += transaction.amount * 0.3;
              accountsReceivable += transaction.amount * 0.7;
            }
          });
          
          // Update asset accounts with calculated balances
          if (assets[0].subaccounts) {
            assets[0].subaccounts[0].balance = cashBalance * 0.4; // Cash
            assets[0].subaccounts[1].balance = cashBalance * 0.6; // Bank Accounts
            assets[0].balance = cashBalance;
          }
          
          assets[1].balance = accountsReceivable;
          
          if (assets[2].subaccounts) {
            assets[2].subaccounts[0].balance = inventory * 0.5; // Raw Materials
            assets[2].subaccounts[1].balance = inventory * 0.2; // Work in Progress
            assets[2].subaccounts[2].balance = inventory * 0.3; // Finished Goods
            assets[2].balance = inventory;
          }
          
          assets[3].balance = propertyEquipment;
          
          assetTotal = cashBalance + accountsReceivable + inventory + propertyEquipment;
          setAssetAccounts(assets);
          setTotalAssets(assetTotal);
        }
        
        // Calculate total liabilities based on transactions
        // This is simplified for demo purposes
        let liabilityTotal = 0;
        if (liabilityTransactions) {
          const liabilities: BalanceSheetAccount[] = [
            {
              id: "5",
              name: "Accounts Payable",
              type: "liability",
              balance: 0,
            },
            {
              id: "6",
              name: "Accrued Expenses",
              type: "liability",
              balance: 0,
            },
            {
              id: "7",
              name: "Short-term Loans",
              type: "liability",
              balance: 0,
            },
            {
              id: "8",
              name: "Long-term Debt",
              type: "liability",
              balance: 0,
            },
          ];
          
          // Calculate liability balances from transactions
          let accountsPayable = 0;
          let accruedExpenses = 0;
          let shortTermLoans = 0;
          let longTermDebt = 0;
          
          liabilityTransactions.forEach(transaction => {
            if (transaction.type === "expense") {
              accountsPayable += transaction.amount * 0.4;
              accruedExpenses += transaction.amount * 0.6;
            } else if (transaction.type === "salary") {
              shortTermLoans += transaction.amount * 0.3;
              longTermDebt += transaction.amount * 0.7;
            }
          });
          
          // Update liability accounts with calculated balances
          liabilities[0].balance = accountsPayable;
          liabilities[1].balance = accruedExpenses;
          liabilities[2].balance = shortTermLoans;
          liabilities[3].balance = longTermDebt;
          
          liabilityTotal = accountsPayable + accruedExpenses + shortTermLoans + longTermDebt;
          setLiabilityAccounts(liabilities);
          setTotalLiabilities(liabilityTotal);
        }
        
        // Calculate equity (Assets - Liabilities)
        const equity = assetTotal - liabilityTotal;
        setTotalEquity(equity);
        
        // Set equity accounts
        setEquityAccounts([
          {
            id: "9",
            name: "Owner's Capital",
            type: "equity",
            balance: equity * 0.8,
          },
          {
            id: "10",
            name: "Retained Earnings",
            type: "equity",
            balance: equity * 0.2,
          },
        ]);
        
      } catch (error) {
        console.error("Error fetching balance sheet data:", error);
      }
    };
    
    fetchBalanceSheetData();
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FinancialNavbar />
      <main className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Balance Sheet</h1>
        <p className="text-muted-foreground mb-6">
          As of {dateRange.to.toLocaleDateString()}
        </p>
        
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
        
        <div className="grid grid-cols-1 gap-6">
          {/* Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetAccounts.map(account => (
                  <div key={account.id}>
                    <div className="flex justify-between font-medium">
                      <span>{account.name}</span>
                      <span>{formatCurrency(account.balance)}</span>
                    </div>
                    {account.subaccounts && account.subaccounts.length > 0 && (
                      <div className="ml-6 mt-2 space-y-1">
                        {account.subaccounts.map(subaccount => (
                          <div key={subaccount.id} className="flex justify-between text-sm text-muted-foreground">
                            <span>{subaccount.name}</span>
                            <span>{formatCurrency(subaccount.balance)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-4">
                  <span>Total Assets</span>
                  <span>{formatCurrency(totalAssets)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Liabilities */}
          <Card>
            <CardHeader>
              <CardTitle>Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liabilityAccounts.map(account => (
                  <div key={account.id}>
                    <div className="flex justify-between font-medium">
                      <span>{account.name}</span>
                      <span>{formatCurrency(account.balance)}</span>
                    </div>
                    {account.subaccounts && account.subaccounts.length > 0 && (
                      <div className="ml-6 mt-2 space-y-1">
                        {account.subaccounts.map(subaccount => (
                          <div key={subaccount.id} className="flex justify-between text-sm text-muted-foreground">
                            <span>{subaccount.name}</span>
                            <span>{formatCurrency(subaccount.balance)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-4">
                  <span>Total Liabilities</span>
                  <span>{formatCurrency(totalLiabilities)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Equity */}
          <Card>
            <CardHeader>
              <CardTitle>Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equityAccounts.map(account => (
                  <div key={account.id}>
                    <div className="flex justify-between font-medium">
                      <span>{account.name}</span>
                      <span>{formatCurrency(account.balance)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-4">
                  <span>Total Equity</span>
                  <span>{formatCurrency(totalEquity)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Total Liabilities and Equity */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Liabilities and Equity</span>
                <span>{formatCurrency(totalLiabilities + totalEquity)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
