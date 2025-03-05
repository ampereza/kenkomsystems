
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { TextField } from "../form-fields/TextField";
import { DateField } from "../form-fields/DateField";
import { NumberField } from "../form-fields/NumberField";
import { SelectSupplierField } from "../form-fields/SelectSupplierField";
import { supabase } from "@/integrations/supabase/client";

export const paymentVoucherSchema = z.object({
  voucher_number: z.string().min(1, { message: "Voucher number is required" }),
  date: z.date(),
  paid_to: z.string().min(1, { message: "Paid to is required" }),
  supplier_id: z.string().optional(),
  amount_in_words: z.string().optional(),
  payment_approved_by: z.string().optional(),
  received_by: z.string().optional(),
  total_amount: z.coerce.number().min(0),
});

export type PaymentVoucherFormValues = z.infer<typeof paymentVoucherSchema>;

interface PaymentVoucherFormProps {
  form: UseFormReturn<PaymentVoucherFormValues>;
}

export function PaymentVoucherForm({ form }: PaymentVoucherFormProps) {
  const handleSupplierChange = (supplierId: string) => {
    // Find the supplier and set the form values
    const fetchSupplier = async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("name")
        .eq("id", supplierId)
        .single();
      
      if (!error && data) {
        form.setValue("paid_to", data.name);
        form.setValue("supplier_id", supplierId);
      }
    };
    
    fetchSupplier();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField 
        control={form.control} 
        name="voucher_number" 
        label="Voucher Number" 
        placeholder="Enter voucher number" 
        required 
      />
      
      <DateField 
        control={form.control} 
        name="date" 
        label="Date" 
        required 
      />
      
      <SelectSupplierField 
        onSupplierSelect={handleSupplierChange} 
        label="Select Supplier/Contractor" 
        required 
      />
      
      <TextField 
        control={form.control} 
        name="paid_to" 
        label="Paid To" 
        placeholder="Enter recipient name" 
        required 
      />
      
      <NumberField
        control={form.control}
        name="total_amount"
        label="Amount"
        placeholder="Enter amount"
        required
      />
      
      <TextField 
        control={form.control} 
        name="amount_in_words" 
        label="Amount in Words" 
        placeholder="Enter amount in words" 
      />
      
      <TextField 
        control={form.control} 
        name="payment_approved_by" 
        label="Approved By" 
        placeholder="Enter approver name" 
      />
      
      <TextField 
        control={form.control} 
        name="received_by" 
        label="Received By" 
        placeholder="Enter receiver name" 
      />
    </div>
  );
}
