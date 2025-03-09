
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface LedgerEntry {
  id: string;
  entry_date: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
}

const GeneralLedger = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Function to format date for Supabase query
  const formatDateForQuery = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Query for chart of accounts
  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ["ledger-accounts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("ledger_accounts")
          .select("*")
          .order("account_name");
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast({
          variant: "destructive",
          title: "Failed to load accounts",
          description: "There was an error loading the account data."
        });
        return [];
      }
    }
  });

  // Query for ledger entries
  const { data: ledgerEntries, isLoading: ledgerLoading } = useQuery({
    queryKey: ["ledger-entries", dateRange, selectedAccount, searchTerm],
    queryFn: async () => {
      try {
        // In a real application, we would query the journal_entries and journal_entry_lines tables
        // For this demo, we'll create some sample data
        const entries: LedgerEntry[] = [
          {
            id: "1",
            entry_date: "2023-01-15",
            description: "Sales revenue",
            account: "Revenue",
            debit: 0,
            credit: 5000,
            balance: 5000,
            reference: "INV-001"
          },
          {
            id: "2",
            entry_date: "2023-01-20",
            description: "Office supplies purchase",
            account: "Expenses",
            debit: 500,
            credit: 0,
            balance: 500,
            reference: "EXP-001"
          },
          {
            id: "3",
            entry_date: "2023-02-01",
            description: "Payment from client",
            account: "Cash",
            debit: 3000,
            credit: 0,
            balance: 3000,
            reference: "PAY-001"
          },
          {
            id: "4",
            entry_date: "2023-02-15",
            description: "Salary payment",
            account: "Expenses",
            debit: 2000,
            credit: 0,
            balance: 2500,
            reference: "SAL-001"
          },
          {
            id: "5",
            entry_date: "2023-03-01",
            description: "Client invoice",
            account: "Revenue",
            debit: 0,
            credit: 4000,
            balance: 9000,
            reference: "INV-002"
          }
        ];
        
        // Filter by date
        let filtered = entries.filter(entry => {
          const entryDate = new Date(entry.entry_date);
          return entryDate >= dateRange.from && entryDate <= dateRange.to;
        });
        
        // Filter by account if selected
        if (selectedAccount !== "all") {
          filtered = filtered.filter(entry => entry.account === selectedAccount);
        }
        
        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(entry => 
            entry.description.toLowerCase().includes(term) ||
            entry.reference.toLowerCase().includes(term)
          );
        }
        
        return filtered;
      } catch (error) {
        console.error("Error fetching ledger entries:", error);
        toast({
          variant: "destructive",
          title: "Failed to load ledger",
          description: "There was an error loading the ledger data."
        });
        return [];
      }
    }
  });

  const isLoading = accountsLoading || ledgerLoading;
  
  // Calculate totals
  const totals = ledgerEntries?.reduce((acc, entry) => {
    acc.debit += entry.debit;
    acc.credit += entry.credit;
    return acc;
  }, { debit: 0, credit: 0 });

  return (
    <>
      <FinancialNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">General Ledger</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Range Selector */}
              <div>
                <DateRangeSelector 
                  dateRange={dateRange} 
                  setDateRange={setDateRange} 
                />
              </div>
              
              {/* Account Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Account</label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Expenses">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Search Box */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search description or reference"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading ledger entries...</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Ledger Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries?.length ? (
                    <>
                      {ledgerEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{new Date(entry.entry_date).toLocaleDateString()}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>{entry.account}</TableCell>
                          <TableCell>{entry.reference}</TableCell>
                          <TableCell className="text-right">
                            {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : ""}
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : ""}
                          </TableCell>
                          <TableCell className="text-right">${entry.balance.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell colSpan={4}>Totals</TableCell>
                        <TableCell className="text-right">${totals?.debit.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${totals?.credit.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No ledger entries found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default GeneralLedger;
