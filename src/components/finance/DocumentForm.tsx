
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Import document form components and schemas
import { PaymentVoucherForm, paymentVoucherSchema } from "./document-forms/PaymentVoucherForm";
import { ReceiptForm, receiptSchema } from "./document-forms/ReceiptForm";
import { useDocumentSubmit } from "./document-utils/useDocumentSubmit";

type DocumentType = "payment-vouchers" | "receipts";

interface DocumentFormProps {
  documentType: DocumentType;
  onSuccess: () => void;
}

export function DocumentForm({ documentType, onSuccess }: DocumentFormProps) {
  // Use the correct schema based on document type
  let schema;
  
  switch (documentType) {
    case "payment-vouchers":
      schema = paymentVoucherSchema;
      break;
    case "receipts":
      schema = receiptSchema;
      break;
    default:
      schema = z.object({});
  }

  // Create the form with the appropriate schema
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
    },
  });

  // Use our custom hook for form submission
  const { handleSubmit, isSubmitting } = useDocumentSubmit(documentType, onSuccess);

  // Handle form submission
  const onSubmit = async (data: any) => {
    await handleSubmit(form, data);
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
