
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface IncomeStatementEntry {
  account_code: string;
  account_name: string;
  account_type: string;
  entry_date?: string;
  reference_number?: string;
  description?: string;
  amount: number;
  total_amount?: number;
}

export function IncomeStatement() {
  const [activeView, setActiveView] = useState("summary");

  const { data: detailedData, isLoading: detailedLoading } = useQuery({
    queryKey: ["income-statement-detailed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income_statement")
        .select("*");

      if (error) throw error;
      return data;
    },
    meta: {
      errorMessage: "Failed to fetch detailed income statement"
    }
  });

  const { data: byAccountData, isLoading: byAccountLoading } = useQuery({
    queryKey: ["income-statement-by-account"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income_statement_by_account")
        .select("*");

      if (error) throw error;
      return data;
    },
    meta: {
      errorMessage: "Failed to fetch income statement by account"
    }
  });

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["income-statement-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income_statement_summary")
        .select("*");

      if (error) throw error;
      return data;
    },
    meta: {
      errorMessage: "Failed to fetch income statement summary"
    }
  });

  const calculateNetIncome = (data: any[]) => {
    return data?.reduce((acc, curr) => {
      if (curr.account_type === 'revenue') {
        return acc + Number(curr.total_amount || 0);
      } else if (curr.account_type === 'expense') {
        return acc - Number(curr.total_amount || 0);
      }
      return acc;
    }, 0) || 0;
  };

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryData?.map((item: IncomeStatementEntry, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="capitalize">{item.account_type}</TableCell>
                    <TableCell className="text-right">
                      ${Number(item.total_amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Net Income</TableCell>
                  <TableCell className="text-right">
                    ${calculateNetIncome(summaryData).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="by-account">
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
                {byAccountData?.map((item: IncomeStatementEntry, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.account_code}</TableCell>
                    <TableCell>{item.account_name}</TableCell>
                    <TableCell className="capitalize">{item.account_type}</TableCell>
                    <TableCell className="text-right">
                      ${Number(item.total_amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell colSpan={3}>Net Income</TableCell>
                  <TableCell className="text-right">
                    ${calculateNetIncome(byAccountData).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="detailed">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedData?.map((item: IncomeStatementEntry, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(item.entry_date!).toLocaleDateString()}</TableCell>
                    <TableCell>{item.reference_number}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.account_name}</TableCell>
                    <TableCell className="capitalize">{item.account_type}</TableCell>
                    <TableCell className="text-right">
                      ${Number(item.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell colSpan={5}>Net Income</TableCell>
                  <TableCell className="text-right">
                    ${calculateNetIncome(detailedData).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
