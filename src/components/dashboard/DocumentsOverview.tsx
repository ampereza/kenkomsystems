
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, CreditCard } from "lucide-react";

export function DocumentsOverview() {
  // Fetch payment vouchers stats
  const { data: paymentVouchersStats } = useQuery({
    queryKey: ["payment-vouchers-stats"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("payment_vouchers")
        .select("*", { count: 'exact', head: true });
      
      if (error) {
        console.error("Error fetching payment vouchers stats:", error);
        throw error;
      }

      return { total: count || 0 };
    },
    meta: {
      errorMessage: "Failed to fetch payment vouchers statistics"
    }
  });

  // Fetch receipts stats
  const { data: receiptsStats } = useQuery({
    queryKey: ["receipts-stats"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("receipts")
        .select("*", { count: 'exact', head: true });
      
      if (error) {
        console.error("Error fetching receipts stats:", error);
        throw error;
      }

      return { total: count || 0 };
    },
    meta: {
      errorMessage: "Failed to fetch receipts statistics"
    }
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Financial Documents</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Vouchers</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentVouchersStats?.total || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Total payment vouchers</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receipts</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receiptsStats?.total || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Total receipts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
