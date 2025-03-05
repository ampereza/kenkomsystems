
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { TextField } from "../form-fields/TextField";
import { DateField } from "../form-fields/DateField";
import { NumberField } from "../form-fields/NumberField";
import { SelectSupplierField } from "../form-fields/SelectSupplierField";
import { supabase } from "@/integrations/supabase/client";

export const expenseAuthSchema = z.object({
  authorization_number: z.string().min(1, { message: "Authorization number is required" }),
  date: z.date(),
  received_from: z.string().optional(),
  supplier_id: z.string().optional(),
  being_payment_of: z.string().optional(),
  cash_cheque_no: z.string().optional(),
  sum_of_shillings: z.coerce.number().min(0),
});

export type ExpenseAuthFormValues = z.infer<typeof expenseAuthSchema>;

interface ExpenseAuthorizationFormProps {
  form: UseFormReturn<ExpenseAuthFormValues>;
}

export function ExpenseAuthorizationForm({ form }: ExpenseAuthorizationFormProps) {
  const handleSupplierChange = (supplierId: string) => {
    // Find the supplier and set the form values
    const fetchSupplier = async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("name")
        .eq("id", supplierId)
        .single();
      
      if (!error && data) {
        form.setValue("received_from", data.name);
        form.setValue("supplier_id", supplierId);
      }
    };
    
    fetchSupplier();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField 
        control={form.control} 
        name="authorization_number" 
        label="Authorization Number" 
        placeholder="Enter authorization number" 
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
      />
      
      <TextField 
        control={form.control} 
        name="received_from" 
        label="Received From" 
        placeholder="Enter source name" 
      />
      
      <NumberField
        control={form.control}
        name="sum_of_shillings"
        label="Amount"
        placeholder="Enter amount"
        required
      />
      
      <TextField 
        control={form.control} 
        name="being_payment_of" 
        label="Being Payment Of" 
        placeholder="Enter payment description" 
      />
      
      <TextField 
        control={form.control} 
        name="cash_cheque_no" 
        label="Cash/Cheque No." 
        placeholder="Enter cash or cheque number" 
      />
    </div>
  );
}
