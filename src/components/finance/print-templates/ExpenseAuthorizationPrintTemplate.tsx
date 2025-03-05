
import { SignatureBlock, formatCurrency, formatDate } from "./BasePrintTemplate";

interface ExpenseAuthorization {
  authorization_number: string;
  date: string;
  received_from?: string;
  sum_of_shillings: number;
  being_payment_of?: string;
  cash_cheque_no?: string;
  balance?: number;
}

interface ExpenseAuthorizationPrintTemplateProps {
  document: ExpenseAuthorization;
}

export function ExpenseAuthorizationPrintTemplate({ document }: ExpenseAuthorizationPrintTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold uppercase">Expense Authorization</h2>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p><strong>Authorization #:</strong> {document.authorization_number}</p>
          <p><strong>Date:</strong> {formatDate(document.date)}</p>
          {document.received_from && (
            <p><strong>Supplier:</strong> {document.received_from}</p>
          )}
        </div>
      </div>
      
      <div className="border-t border-b py-4">
        <p className="mt-4"><strong>Sum of Shillings:</strong> {formatCurrency(document.sum_of_shillings)}</p>
        {document.being_payment_of && (
          <p className="mt-2"><strong>Being Payment Of:</strong> {document.being_payment_of}</p>
        )}
        {document.cash_cheque_no && (
          <p className="mt-2"><strong>Cash/Cheque #:</strong> {document.cash_cheque_no}</p>
        )}
      </div>
      
      <div className="flex justify-between pt-6">
        <div>
          <p><strong>Balance:</strong> {document.balance ? formatCurrency(document.balance) : "0.00"}</p>
        </div>
        <SignatureBlock label="Signature" />
      </div>
    </div>
  );
}
