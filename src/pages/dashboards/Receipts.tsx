
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { ReceiptDialog } from "@/components/receipts/ReceiptDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";

export default function Receipts() {
  const { toast } = useToast();

  const { data: receipts, isLoading } = useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching receipts",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  return (
    <div>
      <FinancialNavbar />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Receipts</h1>
          <ReceiptDialog />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading receipts...</div>
        ) : receipts && receipts.length > 0 ? (
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Receipt No.</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Received From</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Payment Method</th>
                  <th className="text-left p-4">For</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-t">
                    <td className="p-4">{receipt.receipt_number}</td>
                    <td className="p-4">
                      {new Date(receipt.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">{receipt.received_from}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {receipt.amount}
                      </div>
                    </td>
                    <td className="p-4">{receipt.payment_method}</td>
                    <td className="p-4">{receipt.for_payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No receipts found
          </div>
        )}
      </main>
    </div>
  );
}
