
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PaymentVoucherForm, paymentVoucherSchema } from "./document-forms/PaymentVoucherForm";
import { ReceiptForm, receiptSchema } from "./document-forms/ReceiptForm";
import { ExpenseAuthorizationForm, expenseAuthSchema } from "./document-forms/ExpenseAuthorizationForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type DocumentType = "payment-vouchers" | "receipts" | "expense-authorizations";

interface DocumentFormProps {
  documentType: DocumentType;
  onSuccess: () => void;
}

export function DocumentForm({ documentType, onSuccess }: DocumentFormProps) {
  const { toast } = useToast();
  
  // Use appropriate schema based on document type
  const formSchema = 
    documentType === "payment-vouchers" ? paymentVoucherSchema :
    documentType === "receipts" ? receiptSchema :
    expenseAuthSchema;
  
  // Create form with appropriate resolver and type
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  // Submit handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Convert Date objects to ISO strings for Supabase
      const formattedData = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
      };
      
      // Insert data based on document type
      let error;
      
      if (documentType === "payment-vouchers") {
        // Use type assertion to access payment voucher specific fields
        const paymentVoucherData = formattedData as z.infer<typeof paymentVoucherSchema>;
        
        // Ensure required fields for payment vouchers
        if (!paymentVoucherData.voucher_number || !paymentVoucherData.paid_to) {
          throw new Error("Voucher number and paid to are required");
        }
        
        const { error: err } = await supabase
          .from("payment_vouchers")
          .insert({
            date: paymentVoucherData.date,
            voucher_number: paymentVoucherData.voucher_number,
            paid_to: paymentVoucherData.paid_to,
            total_amount: paymentVoucherData.total_amount || 0,
            supplier_id: paymentVoucherData.supplier_id,
            amount_in_words: paymentVoucherData.amount_in_words,
            payment_approved_by: paymentVoucherData.payment_approved_by,
            received_by: paymentVoucherData.received_by
          });
        error = err;
      } else if (documentType === "receipts") {
        // Use type assertion to access receipt specific fields
        const receiptData = formattedData as z.infer<typeof receiptSchema>;
        
        // Ensure required fields for receipts
        if (!receiptData.receipt_number) {
          throw new Error("Receipt number is required");
        }
        
        const { error: err } = await supabase
          .from("receipts")
          .insert({
            date: receiptData.date,
            receipt_number: receiptData.receipt_number,
            received_from: receiptData.received_from,
            amount: receiptData.amount || 0,
            for_payment: receiptData.for_payment,
            payment_method: receiptData.payment_method
          });
        error = err;
      } else if (documentType === "expense-authorizations") {
        // Use type assertion to access expense authorization specific fields
        const expenseAuthData = formattedData as z.infer<typeof expenseAuthSchema>;
        
        // Ensure required fields for expense authorizations
        if (!expenseAuthData.authorization_number) {
          throw new Error("Authorization number is required");
        }
        
        const { error: err } = await supabase
          .from("expense_authorizations")
          .insert({
            date: expenseAuthData.date,
            authorization_number: expenseAuthData.authorization_number,
            sum_of_shillings: expenseAuthData.sum_of_shillings || 0,
            received_from: expenseAuthData.received_from,
            being_payment_of: expenseAuthData.being_payment_of,
            cash_cheque_no: expenseAuthData.cash_cheque_no,
            balance: expenseAuthData.balance || 0,
            signature: expenseAuthData.signature
          });
        error = err;
      }
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `${documentType.replace(/-/g, ' ')} created successfully`,
      });
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create document: ${error.message}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {documentType === "payment-vouchers" && (
          <PaymentVoucherForm form={form} />
        )}
        
        {documentType === "receipts" && (
          <ReceiptForm form={form} />
        )}
        
        {documentType === "expense-authorizations" && (
          <ExpenseAuthorizationForm form={form} />
        )}
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
