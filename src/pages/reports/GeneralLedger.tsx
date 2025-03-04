import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel } from "@/utils/exportUtils";
import { toast } from "@/components/ui/use-toast";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";

export default function GeneralLedger() {
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  const { data: journalEntries, isLoading, error } = useQuery({
    queryKey: ["journal-entries", startDate, endDate],
    queryFn: async () => {
      console.log("Fetching journal entries for date range:", { startDate, endDate });
      
      const { data: entries, error } = await supabase
        .from("journal_entries")
        .select(`
          *,
          journal_entry_lines(
            *,
            ledger_accounts(*)
          )
        `)
        .gte("entry_date", startDate.toISOString())
        .lte("entry_date", endDate.toISOString())
        .order("entry_date");

      if (error) {
        console.error("Error fetching journal entries:", error);
        throw error;
      }

      console.log("Fetched journal entries:", entries);
      return entries;
    },
    meta: {
      errorMessage: "There was a problem loading the general ledger entries."
    }
  });

  const handleExport = () => {
    if (!journalEntries) return;

    const exportData = journalEntries.flatMap(entry => 
      entry.journal_entry_lines.map(line => ({
        Date: new Date(entry.entry_date).toLocaleDateString(),
        Reference: entry.reference_number,
        Description: entry.description,
        Account: line.ledger_accounts.account_name,
        Debit: line.debit_amount || "",
        Credit: line.credit_amount || "",
      }))
    );

    exportToExcel(exportData, `general-ledger-${startDate.toISOString().split('T')[0]}`);
  };

  // Show error toast if there's an error
  if (error) {
    toast({
      title: "Error fetching journal entries",
      description: "There was a problem loading the general ledger entries.",
      variant: "destructive",
    });
  }

  return (
    <>
      <FinancialNavbar />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">General Ledger</h1>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
        
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onRangeSelect={() => {}}
        />

        {isLoading ? (
          <div className="text-center py-8">Loading ledger entries...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading ledger entries. Please try again.
          </div>
        ) : journalEntries?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No journal entries found for the selected date range
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journalEntries?.map((entry) =>
                    entry.journal_entry_lines.map((line, lineIndex) => (
                      <TableRow key={`${entry.id}-${lineIndex}`}>
                        <TableCell>
                          {lineIndex === 0 ? new Date(entry.entry_date).toLocaleDateString() : ""}
                        </TableCell>
                        <TableCell>
                          {lineIndex === 0 ? entry.reference_number : ""}
                        </TableCell>
                        <TableCell>
                          {lineIndex === 0 ? entry.description : ""}
                        </TableCell>
                        <TableCell className="pl-8">
                          {line.ledger_accounts.account_name}
                        </TableCell>
                        <TableCell className="text-right">
                          {line.debit_amount ? `$${Number(line.debit_amount).toFixed(2)}` : ""}
                        </TableCell>
                        <TableCell className="text-right">
                          {line.credit_amount ? `$${Number(line.credit_amount).toFixed(2)}` : ""}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
