
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Plus } from "lucide-react";

export default function Expenses() {
  const { toast } = useToast();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("type", "expense")
        .order("transaction_date", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching expenses",
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
          <h1 className="text-3xl font-bold">Expenses</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Expense
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading expenses...</div>
        ) : expenses && expenses.length > 0 ? (
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Reference</th>
                  <th className="text-left p-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-t">
                    <td className="p-4">
                      {new Date(expense.transaction_date!).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {expense.amount}
                      </div>
                    </td>
                    <td className="p-4">{expense.description}</td>
                    <td className="p-4">{expense.reference_number}</td>
                    <td className="p-4">{expense.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No expenses found
          </div>
        )}
      </main>
    </div>
  );
}
