
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewDialog } from "./PreviewDialog";
import type { DetailedIncomeStatement } from "./income-statement/types";

interface Account {
  account_code: string;
  account_name: string;
  account_type: string;
  balance: number;
}

interface FinancialStatementsProps {
  balanceSheet: Account[] | undefined;
  incomeStatement: DetailedIncomeStatement[] | undefined;
  onExportBalanceSheet: () => void;
  onExportIncomeStatement: () => void;
}

export function FinancialStatements({
  incomeStatement,
  onExportBalanceSheet,
  onExportIncomeStatement,
}: FinancialStatementsProps) {
  // Fetch balance sheet data directly in this component to include payment vouchers
  const { data: balanceSheet, isLoading } = useQuery({
    queryKey: ["balance-sheet-with-vouchers"],
    queryFn: async () => {
      // Fetch base balance sheet data
      const { data: balanceData, error } = await supabase
        .from("balance_sheet")
        .select("*");

      if (error) throw error;
      
      // Fetch payment vouchers that might not be reflected in the balance sheet
      const { data: voucherData, error: voucherError } = await supabase
        .from("payment_vouchers")
        .select("date, voucher_number, paid_to, total_amount");
        
      if (voucherError) throw voucherError;
      
      // Create a map of account balances from the base data
      const accountMap = balanceData.reduce((acc, account) => {
        const key = `${account.account_code}-${account.account_name}-${account.account_type}`;
        acc[key] = {
          account_code: account.account_code,
          account_name: account.account_name,
          account_type: account.account_type,
          balance: Number(account.balance)
        };
        return acc;
      }, {} as Record<string, Account>);
      
      // Check if we have Accounts Payable and Cash accounts, add them if they don't exist
      const apKey = "2000-Accounts Payable-liability";
      const cashKey = "1000-Cash-asset";
      
      if (!accountMap[apKey]) {
        accountMap[apKey] = {
          account_code: "2000",
          account_name: "Accounts Payable",
          account_type: "liability",
          balance: 0
        };
      }
      
      if (!accountMap[cashKey]) {
        accountMap[cashKey] = {
          account_code: "1000",
          account_name: "Cash",
          account_type: "asset",
          balance: 0
        };
      }
      
      // For each payment voucher, check if it's already reflected in the balance sheet
      // by checking if there's a corresponding journal entry
      const { data: journalEntries, error: journalError } = await supabase
        .from("journal_entries")
        .select("reference_number");
        
      if (journalError) throw journalError;
      
      // Get set of existing reference numbers
      const existingReferences = new Set(
        journalEntries.map(entry => entry.reference_number)
      );
      
      // Adjust balances for vouchers that aren't already reflected
      voucherData.forEach(voucher => {
        if (!existingReferences.has(voucher.voucher_number)) {
          // Increase Accounts Payable (liability)
          accountMap[apKey].balance += Number(voucher.total_amount);
          
          // Decrease Cash (asset)
          accountMap[cashKey].balance -= Number(voucher.total_amount);
        }
      });
      
      return Object.values(accountMap);
    }
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Balance Sheet</CardTitle>
          <PreviewDialog
            title="Balance Sheet Preview"
            data={balanceSheet || []}
            columns={[
              { key: "account_code", label: "Account Code" },
              { key: "account_name", label: "Account Name" },
              { key: "account_type", label: "Type" },
              { key: "balance", label: "Balance" },
            ]}
            onExport={onExportBalanceSheet}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading balance sheet data...</div>
          ) : (
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
                {balanceSheet?.map((account, index) => (
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Income Statement</CardTitle>
          <PreviewDialog
            title="Income Statement Preview"
            data={incomeStatement || []}
            columns={[
              { key: "account_code", label: "Account Code" },
              { key: "account_name", label: "Account Name" },
              { key: "account_type", label: "Type" },
              { key: "amount", label: "Amount" },
            ]}
            onExport={onExportIncomeStatement}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomeStatement?.map((account, index) => (
                <TableRow key={index}>
                  <TableCell>{account.account_code}</TableCell>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell className="capitalize">{account.account_type}</TableCell>
                  <TableCell className="text-right">
                    ${Number(account.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
