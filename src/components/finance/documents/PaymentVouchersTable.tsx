
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PrintDocument } from "@/components/finance/PrintDocument";

type PaymentVoucher = {
  id: string;
  voucher_number: string;
  date: string;
  paid_to: string;
  total_amount: number;
  amount_in_words?: string;
  payment_approved_by?: string;
  received_by?: string;
  created_at?: string;
};

interface PaymentVouchersTableProps {
  onViewDocument: (document: PaymentVoucher) => void;
}

export function PaymentVouchersTable({ onViewDocument }: PaymentVouchersTableProps) {
  const { data: paymentVouchers, isLoading } = useQuery({
    queryKey: ["payment-vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching payment vouchers:", error);
        throw error;
      }
      return data as PaymentVoucher[];
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Voucher #</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Paid To</th>
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
          ) : paymentVouchers && paymentVouchers.length > 0 ? (
            paymentVouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td className="border px-4 py-2">{voucher.voucher_number}</td>
                <td className="border px-4 py-2">
                  {format(new Date(voucher.date), "dd/MM/yyyy")}
                </td>
                <td className="border px-4 py-2">{voucher.paid_to}</td>
                <td className="border px-4 py-2">
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KES",
                  }).format(voucher.total_amount)}
                </td>
                <td className="border px-4 py-2 flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onViewDocument(voucher)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <PrintDocument documentType="payment-vouchers" document={voucher} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border px-4 py-2 text-center">
                No payment vouchers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
