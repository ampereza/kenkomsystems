
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileSpreadsheet, Receipt, CreditCard, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export function DocumentsOverview() {
  // Fetch delivery notes stats
  const { data: deliveryNotesStats } = useQuery({
    queryKey: ["delivery-notes-stats"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("delivery_notes")
        .select("*", { count: 'exact', head: true });
      
      if (error) {
        console.error("Error fetching delivery notes stats:", error);
        throw error;
      }

      return { total: count || 0 };
    },
    meta: {
      errorMessage: "Failed to fetch delivery notes statistics"
    }
  });

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

  // Fetch expense authorizations stats
  const { data: expenseAuthStats } = useQuery({
    queryKey: ["expense-auth-stats"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("expense_authorizations")
        .select("*", { count: 'exact', head: true });
      
      if (error) {
        console.error("Error fetching expense authorizations stats:", error);
        throw error;
      }

      return { total: count || 0 };
    },
    meta: {
      errorMessage: "Failed to fetch expense authorizations statistics"
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryNotesStats?.total || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Total delivery notes</div>
          </CardContent>
        </Card>
        
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
            <CardTitle className="text-sm font-medium">Expense Authorizations</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseAuthStats?.total || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Total expense authorizations</div>
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
