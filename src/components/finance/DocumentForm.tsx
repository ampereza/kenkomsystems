
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
        // Ensure required fields for payment vouchers
        if (!formattedData.voucher_number || !formattedData.paid_to) {
          throw new Error("Voucher number and paid to are required");
        }
        
        const { error: err } = await supabase
          .from("payment_vouchers")
          .insert({
            date: formattedData.date,
            voucher_number: formattedData.voucher_number,
            paid_to: formattedData.paid_to,
            total_amount: formattedData.total_amount || 0,
            supplier_id: formattedData.supplier_id,
            amount_in_words: formattedData.amount_in_words,
            payment_approved_by: formattedData.payment_approved_by,
            received_by: formattedData.received_by
          });
        error = err;
      } else if (documentType === "receipts") {
        // Ensure required fields for receipts
        if (!formattedData.receipt_number) {
          throw new Error("Receipt number is required");
        }
        
        const { error: err } = await supabase
          .from("receipts")
          .insert({
            date: formattedData.date,
            receipt_number: formattedData.receipt_number,
            received_from: formattedData.received_from,
            amount: formattedData.amount || 0,
            for_payment: formattedData.for_payment,
            payment_method: formattedData.payment_method
          });
        error = err;
      } else if (documentType === "expense-authorizations") {
        // Ensure required fields for expense authorizations
        if (!formattedData.authorization_number) {
          throw new Error("Authorization number is required");
        }
        
        const { error: err } = await supabase
          .from("expense_authorizations")
          .insert({
            date: formattedData.date,
            authorization_number: formattedData.authorization_number,
            sum_of_shillings: formattedData.sum_of_shillings || 0,
            received_from: formattedData.received_from,
            being_payment_of: formattedData.being_payment_of,
            cash_cheque_no: formattedData.cash_cheque_no,
            balance: formattedData.balance || 0,
            signature: formattedData.signature
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
