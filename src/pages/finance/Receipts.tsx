
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { ReceiptsTable } from "@/components/finance/documents/ReceiptsTable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { AddDocumentDialog } from "@/components/finance/documents/AddDocumentDialog";

export default function Receipts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

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

      return data || [];
    },
  });

  const handleSuccess = () => {
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["receipts"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <FinancialNavbar />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Receipts</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <AddDocumentDialog
              documentType="receipts"
              onSuccess={handleSuccess}
            />
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading receipts...</p>
            </div>
          </div>
        ) : receipts && receipts.length > 0 ? (
          <div className="relative overflow-x-auto rounded-md border">
            <ReceiptsTable receipts={receipts} />
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">No receipts found</h3>
            <p className="text-muted-foreground mt-1">
              Create your first receipt to get started
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Create Receipt
                </Button>
              </DialogTrigger>
              <AddDocumentDialog
                documentType="receipts"
                onSuccess={handleSuccess}
              />
            </Dialog>
          </div>
        )}
      </main>
    </div>
  );
}
