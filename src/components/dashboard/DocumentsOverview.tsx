
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, CreditCard, FileText, BadgeDollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export function DocumentsOverview() {
  const { data: paymentVouchers, isLoading: vouchersLoading } = useQuery({
    queryKey: ["recent-payment-vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_vouchers")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: receipts, isLoading: receiptsLoading } = useQuery({
    queryKey: ["recent-receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("transaction_date", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Financial Documents</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <Link to="/finance/transactions" className="hover:underline">
                View all transactions
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Vouchers</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentVouchers?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <Link to="/finance/payment-vouchers" className="hover:underline">
                View all vouchers
              </Link>
            </div>
            
            {paymentVouchers && paymentVouchers.length > 0 ? (
              <div className="mt-4 space-y-2">
                {paymentVouchers.map((voucher) => (
                  <div key={voucher.id} className="flex justify-between items-center text-sm border-b pb-1">
                    <div className="font-medium truncate" style={{maxWidth: "70%"}}>
                      {voucher.paid_to}
                    </div>
                    <div className="font-semibold">
                      ${Number(voucher.total_amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : vouchersLoading ? (
              <div className="text-xs text-muted-foreground mt-4">Loading vouchers...</div>
            ) : (
              <div className="text-xs text-muted-foreground mt-4">No recent vouchers</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receipts</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receipts?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <Link to="/finance/receipts" className="hover:underline">
                View all receipts
              </Link>
            </div>
            
            {receipts && receipts.length > 0 ? (
              <div className="mt-4 space-y-2">
                {receipts.map((receipt) => (
                  <div key={receipt.id} className="flex justify-between items-center text-sm border-b pb-1">
                    <div className="font-medium truncate" style={{maxWidth: "70%"}}>
                      {receipt.received_from}
                    </div>
                    <div className="font-semibold text-green-600">
                      ${Number(receipt.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : receiptsLoading ? (
              <div className="text-xs text-muted-foreground mt-4">Loading receipts...</div>
            ) : (
              <div className="text-xs text-muted-foreground mt-4">No recent receipts</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
