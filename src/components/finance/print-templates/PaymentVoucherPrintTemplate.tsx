
import { SignatureBlock, formatCurrency, formatDate } from "./BasePrintTemplate";

interface PaymentVoucher {
  voucher_number: string;
  date: string;
  paid_to: string;
  supplier_id?: string;
  total_amount: number;
  amount_in_words?: string;
  payment_approved_by?: string;
  received_by?: string;
}

interface PaymentVoucherPrintTemplateProps {
  document: PaymentVoucher;
}

export function PaymentVoucherPrintTemplate({ document }: PaymentVoucherPrintTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold uppercase">Payment Voucher</h2>
        <p className="text-sm text-gray-500">Expense Document</p>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p><strong>Voucher #:</strong> {document.voucher_number}</p>
          <p><strong>Date:</strong> {formatDate(document.date)}</p>
          <p><strong>Supplier/Paid To:</strong> {document.paid_to}</p>
        </div>
      </div>
      
      <div className="border-t border-b py-4">
        <p className="mt-4"><strong>Amount:</strong> {formatCurrency(document.total_amount)}</p>
        {document.amount_in_words && (
          <p className="mt-2"><strong>Amount in Words:</strong> {document.amount_in_words}</p>
        )}
      </div>
      
      <div className="flex justify-between pt-6">
        <SignatureBlock label="Approved By" name={document.payment_approved_by} />
        <SignatureBlock label="Received By" name={document.received_by} />
      </div>
    </div>
  );
}
