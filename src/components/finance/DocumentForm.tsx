
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Import document form components and schemas
import { DeliveryNoteForm, deliveryNoteSchema, DeliveryNoteFormValues } from "./document-forms/DeliveryNoteForm";
import { PaymentVoucherForm, paymentVoucherSchema, PaymentVoucherFormValues } from "./document-forms/PaymentVoucherForm";
import { ExpenseAuthorizationForm, expenseAuthSchema, ExpenseAuthFormValues } from "./document-forms/ExpenseAuthorizationForm";
import { ReceiptForm, receiptSchema, ReceiptFormValues } from "./document-forms/ReceiptForm";

type DocumentType = "delivery-notes" | "payment-vouchers" | "expense-authorizations" | "receipts";

interface DocumentFormProps {
  documentType: DocumentType;
  onSuccess: () => void;
}

export function DocumentForm({ documentType, onSuccess }: DocumentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the correct schema based on document type
  let schema;
  let tableName;
  
  switch (documentType) {
    case "delivery-notes":
      schema = deliveryNoteSchema;
      tableName = "delivery_notes";
      break;
    case "payment-vouchers":
      schema = paymentVoucherSchema;
      tableName = "payment_vouchers";
      break;
    case "expense-authorizations":
      schema = expenseAuthSchema;
      tableName = "expense_authorizations";
      break;
    case "receipts":
      schema = receiptSchema;
      tableName = "receipts";
      break;
    default:
      schema = z.object({});
      tableName = "";
  }

  // Create the form with the appropriate schema
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
    },
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    if (!tableName) return;
    
    setIsSubmitting(true);
    
    try {
      // Format data for specific document types
      let formattedData = { ...data };
      
      // Make sure date is properly formatted for the database
      if (formattedData.date instanceof Date) {
        formattedData.date = formattedData.date.toISOString();
      }
      
      console.log("Submitting document to table:", tableName, "with data:", formattedData);
      
      // Create the document
      const { data: documentData, error } = await supabase
        .from(tableName)
        .insert([formattedData])
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // If this is a payment voucher, create a corresponding transaction record
      if (tableName === "payment_vouchers" && documentData) {
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert({
            type: "expense",
            amount: documentData.total_amount,
            transaction_date: documentData.date,
            supplier_id: documentData.supplier_id,
            description: `Payment to ${documentData.paid_to} (Voucher #${documentData.voucher_number})`,
            reference_number: documentData.voucher_number
          });
        
        if (transactionError) {
          console.error("Error creating transaction:", transactionError);
          // Continue even if transaction creation fails, to avoid blocking document creation
        }
      }
      
      toast({
        title: "Success",
        description: "Document created successfully",
      });
      
      form.reset({
        date: new Date(),
      });
      onSuccess();
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create document: ${(error as any)?.message || 'Unknown error'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate form based on document type
  const renderForm = () => {
    switch (documentType) {
      case "delivery-notes":
        return <DeliveryNoteForm form={form as any} />;
      case "payment-vouchers":
        return <PaymentVoucherForm form={form as any} />;
      case "expense-authorizations":
        return <ExpenseAuthorizationForm form={form as any} />;
      case "receipts":
        return <ReceiptForm form={form as any} />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {renderForm()}

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset({
              date: new Date(),
            })}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Document"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
