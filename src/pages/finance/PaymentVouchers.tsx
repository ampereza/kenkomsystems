
import { useState } from "react";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { PaymentVouchersTable } from "@/components/finance/documents/PaymentVouchersTable";
import { ViewDocumentDialog } from "@/components/finance/documents/ViewDocumentDialog";
import { AddDocumentDialog } from "@/components/finance/documents/AddDocumentDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PaymentVouchers() {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
  };

  const handleCloseDialog = () => {
    setSelectedDocument(null);
  };

  const handleSuccess = () => {
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FinancialNavbar />
      <main className="container py-4 md:py-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Payment Vouchers</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Payment Voucher
              </Button>
            </DialogTrigger>
            <AddDocumentDialog 
              documentType="payment-vouchers" 
              onSuccess={handleSuccess} 
            />
          </Dialog>
        </div>
        <PaymentVouchersTable onViewDocument={handleViewDocument} />
        
        {selectedDocument && (
          <ViewDocumentDialog
            documentType="payment-vouchers"
            document={selectedDocument}
            onOpenChange={handleCloseDialog}
          />
        )}
      </main>
    </div>
  );
}
