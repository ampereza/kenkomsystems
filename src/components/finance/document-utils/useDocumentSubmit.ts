
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { formatDocumentData, getTableName, createPaymentVoucherTransaction, createReceiptTransaction } from "./submitHelpers";

type DocumentType = "payment-vouchers" | "receipts";

export function useDocumentSubmit(documentType: DocumentType, onSuccess: () => void) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (form: UseFormReturn<any>, data: any) => {
    const tableName = getTableName(documentType);
    if (!tableName) return;
    
    setIsSubmitting(true);
    
    try {
      // Format data for specific document types
      const formattedData = formatDocumentData(data, tableName);
      
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
        const paymentVoucher = documentData[0] as any;
        await createPaymentVoucherTransaction(paymentVoucher);
      }
      
      // If this is a receipt, create a corresponding income transaction record
      if (tableName === "receipts" && documentData && documentData.length > 0) {
        const receipt = documentData[0] as any;
        await createReceiptTransaction(receipt);
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
  
  return { handleSubmit, isSubmitting };
}
