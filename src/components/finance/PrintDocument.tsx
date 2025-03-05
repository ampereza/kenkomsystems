
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";

interface DeliveryNote {
  id: string;
  note_number: string;
  date: string;
  client_name: string;
  batch_number?: string;
  vehicle_number?: string;
  transporter?: string;
  loaded_by?: string;
  received_by?: string;
  total_quantity: number;
  notes?: string;
}

interface PaymentVoucher {
  id: string;
  voucher_number: string;
  date: string;
  paid_to: string;
  total_amount: number;
  amount_in_words?: string;
  payment_approved_by?: string;
  received_by?: string;
}

interface ExpenseAuthorization {
  id: string;
  authorization_number: string;
  date: string;
  received_from?: string;
  sum_of_shillings: number;
  being_payment_of?: string;
  cash_cheque_no?: string;
  balance?: number;
}

interface Receipt {
  id: string;
  receipt_number: string;
  date: string;
  received_from?: string;
  amount: number;
  payment_method?: string;
  for_payment?: string;
}

type DocumentType = "delivery-notes" | "payment-vouchers" | "expense-authorizations" | "receipts";
type Document = DeliveryNote | PaymentVoucher | ExpenseAuthorization | Receipt;

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
    // The content function is required by react-to-print
    content: () => printRef.current,
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
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
            {/* Delivery Note Template */}
            {documentType === "delivery-notes" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold uppercase">Delivery Note</h2>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p><strong>Note #:</strong> {(document as DeliveryNote).note_number}</p>
                    <p><strong>Date:</strong> {formatDate((document as DeliveryNote).date)}</p>
                    <p><strong>Client:</strong> {(document as DeliveryNote).client_name}</p>
                  </div>
                  <div>
                    {(document as DeliveryNote).batch_number && (
                      <p><strong>Batch #:</strong> {(document as DeliveryNote).batch_number}</p>
                    )}
                    {(document as DeliveryNote).vehicle_number && (
                      <p><strong>Vehicle #:</strong> {(document as DeliveryNote).vehicle_number}</p>
                    )}
                    {(document as DeliveryNote).transporter && (
                      <p><strong>Transporter:</strong> {(document as DeliveryNote).transporter}</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-b py-4">
                  <h3 className="text-lg font-semibold mb-2">Items</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">Poles</td>
                        <td className="text-right py-2">{(document as DeliveryNote).total_quantity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between pt-6">
                  <div>
                    <p><strong>Loaded By:</strong> ___________________</p>
                    {(document as DeliveryNote).loaded_by && (
                      <p className="text-sm text-gray-500 mt-1">{(document as DeliveryNote).loaded_by}</p>
                    )}
                  </div>
                  <div>
                    <p><strong>Received By:</strong> ___________________</p>
                    {(document as DeliveryNote).received_by && (
                      <p className="text-sm text-gray-500 mt-1">{(document as DeliveryNote).received_by}</p>
                    )}
                  </div>
                </div>
                
                {(document as DeliveryNote).notes && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Notes</h3>
                    <p className="text-gray-700">{(document as DeliveryNote).notes}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Payment Voucher Template */}
            {documentType === "payment-vouchers" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold uppercase">Payment Voucher</h2>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p><strong>Voucher #:</strong> {(document as PaymentVoucher).voucher_number}</p>
                    <p><strong>Date:</strong> {formatDate((document as PaymentVoucher).date)}</p>
                  </div>
                </div>
                
                <div className="border-t border-b py-4">
                  <p><strong>Paid To:</strong> {(document as PaymentVoucher).paid_to}</p>
                  <p className="mt-4"><strong>Amount:</strong> {formatCurrency((document as PaymentVoucher).total_amount)}</p>
                  {(document as PaymentVoucher).amount_in_words && (
                    <p className="mt-2"><strong>Amount in Words:</strong> {(document as PaymentVoucher).amount_in_words}</p>
                  )}
                </div>
                
                <div className="flex justify-between pt-6">
                  <div>
                    <p><strong>Approved By:</strong> ___________________</p>
                    {(document as PaymentVoucher).payment_approved_by && (
                      <p className="text-sm text-gray-500 mt-1">{(document as PaymentVoucher).payment_approved_by}</p>
                    )}
                  </div>
                  <div>
                    <p><strong>Received By:</strong> ___________________</p>
                    {(document as PaymentVoucher).received_by && (
                      <p className="text-sm text-gray-500 mt-1">{(document as PaymentVoucher).received_by}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Expense Authorization Template */}
            {documentType === "expense-authorizations" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold uppercase">Expense Authorization</h2>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p><strong>Authorization #:</strong> {(document as ExpenseAuthorization).authorization_number}</p>
                    <p><strong>Date:</strong> {formatDate((document as ExpenseAuthorization).date)}</p>
                  </div>
                </div>
                
                <div className="border-t border-b py-4">
                  {(document as ExpenseAuthorization).received_from && (
                    <p><strong>Received From:</strong> {(document as ExpenseAuthorization).received_from}</p>
                  )}
                  <p className="mt-4"><strong>Sum of Shillings:</strong> {formatCurrency((document as ExpenseAuthorization).sum_of_shillings)}</p>
                  {(document as ExpenseAuthorization).being_payment_of && (
                    <p className="mt-2"><strong>Being Payment Of:</strong> {(document as ExpenseAuthorization).being_payment_of}</p>
                  )}
                  {(document as ExpenseAuthorization).cash_cheque_no && (
                    <p className="mt-2"><strong>Cash/Cheque #:</strong> {(document as ExpenseAuthorization).cash_cheque_no}</p>
                  )}
                </div>
                
                <div className="flex justify-between pt-6">
                  <div>
                    <p><strong>Balance:</strong> {(document as ExpenseAuthorization).balance ? formatCurrency((document as ExpenseAuthorization).balance) : "0.00"}</p>
                  </div>
                  <div>
                    <p><strong>Signature:</strong> ___________________</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Receipt Template */}
            {documentType === "receipts" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold uppercase">Receipt</h2>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p><strong>Receipt #:</strong> {(document as Receipt).receipt_number}</p>
                    <p><strong>Date:</strong> {formatDate((document as Receipt).date)}</p>
                  </div>
                </div>
                
                <div className="border-t border-b py-4">
                  {(document as Receipt).received_from && (
                    <p><strong>Received From:</strong> {(document as Receipt).received_from}</p>
                  )}
                  <p className="mt-4"><strong>Amount:</strong> {formatCurrency((document as Receipt).amount)}</p>
                  {(document as Receipt).payment_method && (
                    <p className="mt-2"><strong>Payment Method:</strong> {(document as Receipt).payment_method}</p>
                  )}
                  {(document as Receipt).for_payment && (
                    <p className="mt-2"><strong>For Payment of:</strong> {(document as Receipt).for_payment}</p>
                  )}
                </div>
                
                <div className="flex justify-between pt-6">
                  <div>
                    <p><strong>Cashier:</strong> ___________________</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
