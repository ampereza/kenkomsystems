
import { format } from "date-fns";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PrintDocument } from "@/components/finance/PrintDocument";

type DocumentType = "delivery-notes" | "payment-vouchers" | "expense-authorizations" | "receipts";

interface ViewDocumentDialogProps {
  documentType: DocumentType;
  document: any;
}

export function ViewDocumentDialog({ documentType, document }: ViewDocumentDialogProps) {
  if (!document) return null;
  
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>View Document</DialogTitle>
      </DialogHeader>
      
      <div className="p-4">
        <PrintDocument 
          documentType={documentType} 
          document={document} 
        />
        
        <div className="mt-4 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Document Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(document).map(([key, value]) => {
              if (key === "id" || key === "created_at") return null;
              
              let displayValue = value as string | number;
              
              // Format dates
              if (key === "date" && typeof value === "string") {
                try {
                  displayValue = format(new Date(value), "PPP");
                } catch (e) {
                  displayValue = value;
                }
              }
              
              // Format currency amounts
              if ((key === "amount" || key === "total_amount" || key === "sum_of_shillings") && typeof value === "number") {
                displayValue = new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                }).format(value as number);
              }
              
              const displayKey = key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
              
              return (
                <div key={key} className="mb-2">
                  <p className="font-medium text-gray-700">{displayKey}:</p>
                  <p>{displayValue?.toString() || "-"}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
