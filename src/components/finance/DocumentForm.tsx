
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PaymentVoucherForm, paymentVoucherSchema } from "./document-forms/PaymentVoucherForm";
import { ReceiptForm, receiptSchema } from "./document-forms/ReceiptForm";
import { ExpenseAuthorizationForm, expenseAuthSchema } from "./document-forms/ExpenseAuthorizationForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";

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
  
  // Create form with appropriate resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  // Submit handler
  const onSubmit = async (data: any) => {
    try {
      let tableName = "";
      
      // Determine table name based on document type
      if (documentType === "payment-vouchers") {
        tableName = "payment_vouchers";
      } else if (documentType === "receipts") {
        tableName = "receipts";
      } else if (documentType === "expense-authorizations") {
        tableName = "expense_authorizations";
      }
      
      // Insert data
      const { error } = await supabase.from(tableName).insert(data);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `${documentType.replace('-', ' ')} created successfully`,
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
