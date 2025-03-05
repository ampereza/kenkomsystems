
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentForm } from "@/components/finance/DocumentForm";

type DocumentType = "delivery-notes" | "payment-vouchers" | "expense-authorizations" | "receipts";

interface AddDocumentDialogProps {
  documentType: DocumentType;
  onSuccess: () => void;
}

export function AddDocumentDialog({ documentType, onSuccess }: AddDocumentDialogProps) {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          Add New {documentType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </DialogTitle>
      </DialogHeader>
      <DocumentForm 
        documentType={documentType} 
        onSuccess={onSuccess} 
      />
    </DialogContent>
  );
}
