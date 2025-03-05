
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PrintDocument } from "@/components/finance/PrintDocument";

type Receipt = {
  id: string;
  receipt_number: string;
  date: string;
  received_from: string;
  amount: number;
};

interface ReceiptsTableProps {
  onViewDocument: (document: Receipt) => void;
}

export function ReceiptsTable({ onViewDocument }: ReceiptsTableProps) {
  const { data: receipts, isLoading } = useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Receipt[];
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Receipt #</th>
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
          ) : receipts && receipts.length > 0 ? (
            receipts.map((receipt) => (
              <tr key={receipt.id}>
                <td className="border px-4 py-2">{receipt.receipt_number}</td>
                <td className="border px-4 py-2">
                  {format(new Date(receipt.date), "dd/MM/yyyy")}
                </td>
                <td className="border px-4 py-2">{receipt.received_from}</td>
                <td className="border px-4 py-2">
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KES",
                  }).format(receipt.amount)}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onViewDocument(receipt)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <PrintDocument documentType="receipts" document={receipt} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border px-4 py-2 text-center">
                No receipts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
