
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
      const { data, error } = await supabase
        .from("income_statement")
        .select("*");

      if (error) throw error;
      return data as DetailedIncomeStatement[];
    },
  });

  const { data: byAccountData, isLoading: byAccountLoading } = useQuery({
    queryKey: ["income-statement-by-account"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income_statement_by_account")
        .select("*");

      if (error) throw error;
      return data as AccountIncomeStatement[];
    },
  });

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["income-statement-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income_statement_summary")
        .select("*");

      if (error) throw error;
      return data as BaseIncomeStatement[];
    },
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
