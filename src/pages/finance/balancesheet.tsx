
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface BalanceSheetSummary {
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
}

interface BalanceSheetDetail {
  category: string;
  description: string;
  amount: number;
}

const BalanceSheetPage = () => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<BalanceSheetSummary | null>(null);
  const [detailed, setDetailed] = useState<BalanceSheetDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalanceSheetData = async () => {
      setLoading(true);
      try {
        // Fetch transactions for assets (using purchase as proxy for asset)
        const { data: assetTransactions, error: assetError } = await supabase
          .from("transactions")
          .select("*")
          .eq("type", "purchase");

        if (assetError) throw assetError;

        // Fetch transactions for liabilities (using expense as proxy for liability)
        const { data: liabilityTransactions, error: liabilityError } = await supabase
          .from("transactions")
          .select("*")
          .eq("type", "expense");

        if (liabilityError) throw liabilityError;

        // Calculate totals
        const totalAssets = assetTransactions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const totalLiabilities = liabilityTransactions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const totalEquity = totalAssets - totalLiabilities;

        // Create summary
        setSummary({
          total_assets: totalAssets,
          total_liabilities: totalLiabilities,
          total_equity: totalEquity
        });

        // Create detailed view
        const detailedItems: BalanceSheetDetail[] = [
          ...assetTransactions?.map(t => ({
            category: 'Assets',
            description: t.description || 'Asset',
            amount: Number(t.amount)
          })) || [],
          ...liabilityTransactions?.map(t => ({
            category: 'Liabilities',
            description: t.description || 'Liability',
            amount: Number(t.amount)
          })) || []
        ];

        // Add equity as a manual entry
        detailedItems.push({
          category: 'Equity',
          description: 'Calculated Equity',
          amount: totalEquity
        });

        setDetailed(detailedItems);
      } catch (error) {
        console.error("Error fetching balance sheet data:", error);
        toast({
          variant: "destructive",
          title: "Failed to load balance sheet",
          description: "There was an error loading the balance sheet data."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceSheetData();
  }, [toast]);

  return (
    <>
      <FinancialNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Balance Sheet</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading balance sheet data...</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            {summary && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-muted-foreground">Total Assets</h3>
                      <p className="text-2xl font-bold">${summary.total_assets.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-muted-foreground">Total Liabilities</h3>
                      <p className="text-2xl font-bold">${summary.total_liabilities.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-muted-foreground">Total Equity</h3>
                      <p className={`text-2xl font-bold ${summary.total_equity < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ${summary.total_equity.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Detailed View */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Balance Sheet</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailed.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className="text-right">${entry.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default BalanceSheetPage;
