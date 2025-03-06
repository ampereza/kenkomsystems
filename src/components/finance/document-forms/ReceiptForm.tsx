
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { TextField } from "../form-fields/TextField";
import { DateField } from "../form-fields/DateField";
import { NumberField } from "../form-fields/NumberField";
import { SelectClientField } from "../form-fields/SelectClientField";
import { supabase } from "@/integrations/supabase/client";

export const receiptSchema = z.object({
  receipt_number: z.string().min(1, { message: "Receipt number is required" }),
  date: z.date(),
  received_from: z.string().optional(),
  payment_method: z.string().optional(),
  for_payment: z.string().optional(),
  amount: z.coerce.number().min(0),
});

export type ReceiptFormValues = z.infer<typeof receiptSchema>;

interface ReceiptFormProps {
  form: UseFormReturn<ReceiptFormValues>;
}

export function ReceiptForm({ form }: ReceiptFormProps) {
  const handleClientChange = (clientId: string) => {
    // Find the client and set the form values
    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("name")
        .eq("id", clientId)
        .single();
      
      if (!error && data) {
        form.setValue("received_from", data.name);
      }
    };
    
    fetchClient();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField 
        control={form.control} 
        name="receipt_number" 
        label="Receipt Number" 
        placeholder="Enter receipt number" 
        required 
      />
      
      <DateField 
        control={form.control} 
        name="date" 
        label="Date" 
        required 
      />
      
      <SelectClientField 
        onClientSelect={handleClientChange} 
        label="Select Client" 
      />
      
      <TextField 
        control={form.control} 
        name="received_from" 
        label="Received From" 
        placeholder="Enter source name" 
      />
      
      <NumberField
        control={form.control}
        name="amount"
        label="Amount"
        placeholder="Enter amount"
        required
      />
      
      <TextField 
        control={form.control} 
        name="payment_method" 
        label="Payment Method" 
        placeholder="Enter payment method" 
      />
      
      <TextField 
        control={form.control} 
        name="for_payment" 
        label="For Payment" 
        placeholder="Enter payment description" 
      />
    </div>
  );
}
