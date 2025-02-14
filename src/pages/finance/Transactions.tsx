
import { Navbar } from "@/components/Navbar";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";

export default function Transactions() {
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          suppliers (
            name
          ),
          sorted_stock (
            id,
            category,
            size
          )
        `)
        .order("transaction_date", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching transactions",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  return (
    <div>
      <Navbar />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <TransactionDialog />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : transactions && transactions.length > 0 ? (
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Reference</th>
                  <th className="text-left p-4">Related To</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t">
                    <td className="p-4">
                      {new Date(transaction.transaction_date!).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="capitalize">{transaction.type}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {transaction.amount}
                      </div>
                    </td>
                    <td className="p-4">{transaction.description}</td>
                    <td className="p-4">{transaction.reference_number}</td>
                    <td className="p-4">
                      {transaction.suppliers?.name || 
                       (transaction.sorted_stock && 
                        `${transaction.sorted_stock.category} - ${transaction.sorted_stock.size}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        )}
      </main>
    </div>
  );
}
