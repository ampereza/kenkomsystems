
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type DocumentType = "payment-vouchers" | "receipts";

export const getTableName = (documentType: DocumentType): string => {
  switch (documentType) {
    case "payment-vouchers":
      return "payment_vouchers";
    case "receipts":
      return "receipts";
    default:
      return "";
  }
};

export const formatDocumentData = (data: any, tableName: string) => {
  let formattedData = { ...data };
  
  // Make sure date is properly formatted for the database
  if (formattedData.date instanceof Date) {
    formattedData.date = formattedData.date.toISOString();
  }
  
  // Remove client_id from receipt data as it's not in the database schema
  if (tableName === "receipts" && formattedData.client_id) {
    delete formattedData.client_id;
  }
  
  return formattedData;
};

export const createPaymentVoucherTransaction = async (paymentVoucher: {
  id: string;
  total_amount: number;
  date: string;
  supplier_id?: string;
  paid_to: string;
  voucher_number: string;
}) => {
  const { error: transactionError } = await supabase
    .from("transactions")
    .insert({
      type: "expense",  // Explicitly set type to expense
      amount: paymentVoucher.total_amount,
      transaction_date: paymentVoucher.date,
      supplier_id: paymentVoucher.supplier_id,
      description: `Payment to ${paymentVoucher.paid_to} (Voucher #${paymentVoucher.voucher_number})`,
      reference_number: paymentVoucher.voucher_number
    });
  
  if (transactionError) {
    console.error("Error creating transaction:", transactionError);
  }
};

export const createReceiptTransaction = async (receipt: {
  id: string;
  amount: number;
  date: string;
  received_from?: string;
  receipt_number: string;
  for_payment?: string;
}) => {
  const { error: transactionError } = await supabase
    .from("transactions")
    .insert({
      type: "sale",  // Set type to sale for income
      amount: receipt.amount,
      transaction_date: receipt.date,
      description: `Receipt from ${receipt.received_from || 'customer'} ${receipt.for_payment ? `for ${receipt.for_payment}` : ''}`,
      reference_number: receipt.receipt_number
    });
  
  if (transactionError) {
    console.error("Error creating transaction:", transactionError);
  }
  
  console.log("Receipt transaction created - financial summary view will update automatically");
};
