
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
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
      // First fetch regular expenses from transactions table
      const { data: transactionExpenses, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("type", "expense")
        .order("transaction_date", { ascending: false });

      if (transactionError) {
        toast({
          variant: "destructive",
          title: "Error fetching expenses",
          description: transactionError.message,
        });
        throw transactionError;
      }

      // Then fetch payment vouchers and format them as expenses
      const { data: paymentVouchers, error: voucherError } = await supabase
        .from("payment_vouchers")
        .select("*")
        .order("date", { ascending: false });

      if (voucherError) {
        toast({
          variant: "destructive",
          title: "Error fetching payment vouchers",
          description: voucherError.message,
        });
        throw voucherError;
      }

      // Convert payment vouchers to the same format as transactions
      const voucherExpenses = paymentVouchers.map(voucher => ({
        id: voucher.id,
        type: "expense",
        amount: voucher.total_amount,
        transaction_date: voucher.date,
        reference_number: voucher.voucher_number,
        description: `Payment to ${voucher.paid_to}`,
        supplier_id: voucher.supplier_id,
        notes: voucher.amount_in_words
      }));

      // Combine both types of expenses
      return [...transactionExpenses, ...voucherExpenses];
    },
  });

  return (
    <div>
      <FinancialNavbar />
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
                      {new Date(expense.transaction_date).toLocaleDateString()}
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
