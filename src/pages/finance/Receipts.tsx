
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, Trash } from "lucide-react";
import { ReceiptsTable } from "@/components/finance/documents/ReceiptsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ViewDocumentDialog } from "@/components/finance/documents/ViewDocumentDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ReceiptDialog } from "@/components/receipts/ReceiptDialog";

export default function Receipts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewReceipt, setViewReceipt] = useState(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleViewReceipt = (receipt: any) => {
    setViewReceipt(receipt);
  };

  const handleDeleteReceipt = (id: string) => {
    setSelectedReceiptId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReceiptId) return;
    
    try {
      const { error } = await supabase
        .from("receipts")
        .delete()
        .eq("id", selectedReceiptId);
      
      if (error) throw error;
      
      toast({
        title: "Receipt deleted",
        description: "The receipt has been successfully deleted",
      });
      
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting receipt",
        description: (error as Error).message,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedReceiptId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FinancialNavbar />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Receipts</h1>
          <ReceiptDialog />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading receipts...</p>
            </div>
          </div>
        ) : receipts && receipts.length > 0 ? (
          <div className="relative overflow-x-auto rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">Receipt #</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Received From</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="bg-background border-b hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">{receipt.receipt_number}</td>
                    <td className="px-6 py-4">{new Date(receipt.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{receipt.received_from}</td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat("en-UG", {
                        style: "currency",
                        currency: "UGX",
                        maximumFractionDigits: 0,
                      }).format(receipt.amount)}
                    </td>
                    <td className="px-6 py-4">{receipt.payment_method || "Cash"}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewReceipt(receipt)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon" 
                        className="text-red-500"
                        onClick={() => handleDeleteReceipt(receipt.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">No receipts found</h3>
            <p className="text-muted-foreground mt-1">
              Create your first receipt to get started
            </p>
            <ReceiptDialog />
          </div>
        )}
      </main>

      {viewReceipt && (
        <ViewDocumentDialog
          documentType="receipts"
          document={viewReceipt}
          onOpenChange={() => setViewReceipt(null)}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected receipt and related records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
