
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PrintDocument } from "@/components/finance/PrintDocument";

type ExpenseAuthorization = {
  id: string;
  authorization_number: string;
  date: string;
  received_from: string;
  sum_of_shillings: number;
};

interface ExpenseAuthorizationsTableProps {
  onViewDocument: (document: ExpenseAuthorization) => void;
}

export function ExpenseAuthorizationsTable({ onViewDocument }: ExpenseAuthorizationsTableProps) {
  const { data: expenseAuths, isLoading } = useQuery({
    queryKey: ["expense-authorizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expense_authorizations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ExpenseAuthorization[];
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Auth #</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Received From</th>
            <th className="border px-4 py-2 text-left">Amount</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="border px-4 py-2 text-center">
                Loading...
              </td>
            </tr>
          ) : expenseAuths && expenseAuths.length > 0 ? (
            expenseAuths.map((auth) => (
              <tr key={auth.id}>
                <td className="border px-4 py-2">{auth.authorization_number}</td>
                <td className="border px-4 py-2">
                  {format(new Date(auth.date), "dd/MM/yyyy")}
                </td>
                <td className="border px-4 py-2">{auth.received_from}</td>
                <td className="border px-4 py-2">
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KES",
                  }).format(auth.sum_of_shillings)}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onViewDocument(auth)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <PrintDocument documentType="expense-authorizations" document={auth} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border px-4 py-2 text-center">
                No expense authorizations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
