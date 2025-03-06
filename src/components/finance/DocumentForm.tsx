
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Import document form components and schemas
import { PaymentVoucherForm, paymentVoucherSchema, PaymentVoucherFormValues } from "./document-forms/PaymentVoucherForm";
import { ReceiptForm, receiptSchema, ReceiptFormValues } from "./document-forms/ReceiptForm";

type DocumentType = "payment-vouchers" | "receipts";

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
    case "payment-vouchers":
      schema = paymentVoucherSchema;
      tableName = "payment_vouchers";
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
      
      // Remove client_id from receipt data as it's not in the database schema
      if (tableName === "receipts" && formattedData.client_id) {
        delete formattedData.client_id;
      }
      
      console.log("Submitting document to table:", tableName, "with data:", formattedData);
      
      // Create the document
      const { data: documentData, error } = await supabase
        .from(tableName)
        .insert([formattedData])
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // If this is a payment voucher, create a corresponding transaction record
      if (tableName === "payment_vouchers" && documentData && documentData.length > 0) {
        const paymentVoucher = documentData[0] as unknown as {
          id: string;
          total_amount: number;
          date: string;
          supplier_id?: string;
          paid_to: string;
          voucher_number: string;
        };
        
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
      }
      
      // If this is a receipt, create a corresponding income transaction record
      if (tableName === "receipts" && documentData && documentData.length > 0) {
        const receipt = documentData[0] as unknown as {
          id: string;
          amount: number;
          date: string;
          received_from?: string;
          receipt_number: string;
          for_payment?: string;
        };
        
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
      case "payment-vouchers":
        return <PaymentVoucherForm form={form as any} />;
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
