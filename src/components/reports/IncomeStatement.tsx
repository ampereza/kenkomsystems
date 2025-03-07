
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryView } from "./income-statement/SummaryView";
import { AccountView } from "./income-statement/AccountView";
import { DetailedView } from "./income-statement/DetailedView";
import { calculateNetIncome } from "./income-statement/utils";
import type { BaseIncomeStatement, AccountIncomeStatement, DetailedIncomeStatement } from "./income-statement/types";

export function IncomeStatement() {
  const [activeView, setActiveView] = React.useState("summary");

  const { data: detailedData, isLoading: detailedLoading } = useQuery({
    queryKey: ["income-statement-detailed"],
    queryFn: async () => {
      // First fetch regular income statement data
      const { data: journalData, error } = await supabase
        .from("income_statement")
        .select("*");

      if (error) throw error;
      
      // Also fetch payment vouchers that may not be in the income statement yet
      const { data: voucherData, error: voucherError } = await supabase
        .from("payment_vouchers")
        .select("date, voucher_number, paid_to, total_amount");
        
      if (voucherError) throw voucherError;
      
      // Also fetch receipts that may not be in the income statement yet
      const { data: receiptData, error: receiptError } = await supabase
        .from("receipts")
        .select("date, receipt_number, received_from, amount");
        
      if (receiptError) throw receiptError;
      
      // Convert payment vouchers to income statement format if they're not already in journal entries
      const voucherEntries = voucherData.map(voucher => {
        // Check if this voucher is already included in journal entries
        const existingEntry = journalData.find(
          entry => entry.reference_number === voucher.voucher_number
        );
        
        // Only include if not already in income statement data
        if (!existingEntry) {
          return {
            entry_date: voucher.date,
            amount: voucher.total_amount,
            account_code: '2000',
            account_name: 'Accounts Payable',
            account_type: 'expense',
            reference_number: voucher.voucher_number,
            description: `Payment to ${voucher.paid_to}`
          };
        }
        return null;
      }).filter(entry => entry !== null);
      
      // Convert receipts to income statement format if they're not already in journal entries
      const receiptEntries = receiptData.map(receipt => {
        // Check if this receipt is already included in journal entries
        const existingEntry = journalData.find(
          entry => entry.reference_number === receipt.receipt_number
        );
        
        // Only include if not already in income statement data
        if (!existingEntry) {
          return {
            entry_date: receipt.date,
            amount: receipt.amount,
            account_code: '4000',
            account_name: 'Sales Revenue',
            account_type: 'revenue',
            reference_number: receipt.receipt_number,
            description: `Receipt from ${receipt.received_from}`
          };
        }
        return null;
      }).filter(entry => entry !== null);
      
      // Combine all data sources
      return [...journalData, ...voucherEntries, ...receiptEntries] as DetailedIncomeStatement[];
    },
  });

  const { data: byAccountData, isLoading: byAccountLoading } = useQuery({
    queryKey: ["income-statement-by-account"],
    queryFn: async () => {
      // Get the detailed data first
      const detailedResults = await detailedData || [];
      if (!detailedResults.length) {
        const { data, error } = await supabase
          .from("income_statement_by_account")
          .select("*");

        if (error) throw error;
        return data as AccountIncomeStatement[];
      }
      
      // Group the detailed data by account
      const accountGroups = detailedResults.reduce((acc, item) => {
        const key = `${item.account_code}-${item.account_name}-${item.account_type}`;
        if (!acc[key]) {
          acc[key] = {
            account_code: item.account_code,
            account_name: item.account_name,
            account_type: item.account_type,
            total_amount: 0
          };
        }
        acc[key].total_amount += Number(item.amount);
        return acc;
      }, {} as Record<string, AccountIncomeStatement>);
      
      return Object.values(accountGroups);
    },
    enabled: !!detailedData,
  });

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["income-statement-summary"],
    queryFn: async () => {
      // Get the account data first
      const accountResults = await byAccountData || [];
      if (!accountResults.length) {
        const { data, error } = await supabase
          .from("income_statement_summary")
          .select("*");

        if (error) throw error;
        return data as BaseIncomeStatement[];
      }
      
      // Group the account data by type
      const typeGroups = accountResults.reduce((acc, item) => {
        if (!acc[item.account_type]) {
          acc[item.account_type] = {
            account_type: item.account_type,
            total_amount: 0
          };
        }
        acc[item.account_type].total_amount += Number(item.total_amount);
        return acc;
      }, {} as Record<string, BaseIncomeStatement>);
      
      return Object.values(typeGroups);
    },
    enabled: !!byAccountData,
  });

  const isLoading = detailedLoading || byAccountLoading || summaryLoading;

  if (isLoading) {
    return <div className="text-center py-8">Loading income statement data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Statement</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="by-account">By Account</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <SummaryView data={summaryData || []} calculateNetIncome={calculateNetIncome} />
          </TabsContent>

          <TabsContent value="by-account">
            <AccountView data={byAccountData || []} calculateNetIncome={calculateNetIncome} />
          </TabsContent>

          <TabsContent value="detailed">
            <DetailedView data={detailedData || []} calculateNetIncome={calculateNetIncome} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
