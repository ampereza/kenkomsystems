
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";
import { PaymentVoucherPrintTemplate } from "./print-templates/PaymentVoucherPrintTemplate";
import { ReceiptPrintTemplate } from "./print-templates/ReceiptPrintTemplate";

interface PaymentVoucher {
  id: string;
  voucher_number: string;
  date: string;
  paid_to: string;
  supplier_id?: string;
  total_amount: number;
  amount_in_words?: string;
  payment_approved_by?: string;
  received_by?: string;
}

interface Receipt {
  id: string;
  receipt_number: string;
  date: string;
  received_from?: string;
  client_id?: string;
  amount: number;
  payment_method?: string;
  for_payment?: string;
}

type DocumentType = "payment-vouchers" | "receipts";
type Document = PaymentVoucher | Receipt;

interface PrintDocumentProps {
  documentType: DocumentType;
  document: Document;
}

export function PrintDocument({ documentType, document }: PrintDocumentProps) {
  const [open, setOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    documentTitle: `${documentType}-${(document as any).id}`,
    onAfterPrint: () => setOpen(false),
    contentRef: printRef,
  });

  const renderTemplate = () => {
    switch (documentType) {
      case "payment-vouchers":
        return <PaymentVoucherPrintTemplate document={document as PaymentVoucher} />;
      case "receipts":
        return <ReceiptPrintTemplate document={document as Receipt} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-1" /> Print
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Print Document</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <Button 
            onClick={() => handlePrint()} 
            className="mb-4"
          >
            <Printer className="h-4 w-4 mr-2" /> Print Document
          </Button>
          
          <div ref={printRef} className="p-6 border rounded-lg bg-white">
            {renderTemplate()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
