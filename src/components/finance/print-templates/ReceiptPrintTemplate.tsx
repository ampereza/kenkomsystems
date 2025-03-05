
import { SignatureBlock, formatCurrency, formatDate } from "./BasePrintTemplate";

interface Receipt {
  receipt_number: string;
  date: string;
  received_from?: string;
  amount: number;
  payment_method?: string;
  for_payment?: string;
}

interface ReceiptPrintTemplateProps {
  document: Receipt;
}

export function ReceiptPrintTemplate({ document }: ReceiptPrintTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold uppercase">Receipt</h2>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p><strong>Receipt #:</strong> {document.receipt_number}</p>
          <p><strong>Date:</strong> {formatDate(document.date)}</p>
          {document.received_from && (
            <p><strong>Client:</strong> {document.received_from}</p>
          )}
        </div>
      </div>
      
      <div className="border-t border-b py-4">
        <p className="mt-4"><strong>Amount:</strong> {formatCurrency(document.amount)}</p>
        {document.payment_method && (
          <p className="mt-2"><strong>Payment Method:</strong> {document.payment_method}</p>
        )}
        {document.for_payment && (
          <p className="mt-2"><strong>For Payment of:</strong> {document.for_payment}</p>
        )}
      </div>
      
      <div className="flex justify-between pt-6">
        <SignatureBlock label="Cashier" />
      </div>
    </div>
  );
}
