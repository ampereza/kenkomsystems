
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { TextField } from "../form-fields/TextField";
import { DateField } from "../form-fields/DateField";
import { NumberField } from "../form-fields/NumberField";
import { TextareaField } from "../form-fields/TextareaField";
import { SelectClientField } from "../form-fields/SelectClientField";

export const deliveryNoteSchema = z.object({
  note_number: z.string().min(1, { message: "Note number is required" }),
  date: z.date(),
  client_name: z.string().min(1, { message: "Client name is required" }),
  client_id: z.string().optional(),
  batch_number: z.string().optional(),
  vehicle_number: z.string().optional(),
  transporter: z.string().optional(),
  loaded_by: z.string().optional(),
  notes: z.string().optional(),
  total_quantity: z.coerce.number().min(0),
});

export type DeliveryNoteFormValues = z.infer<typeof deliveryNoteSchema>;

interface DeliveryNoteFormProps {
  form: UseFormReturn<DeliveryNoteFormValues>;
}

export function DeliveryNoteForm({ form }: DeliveryNoteFormProps) {
  const handleClientChange = (clientId: string) => {
    // Find the client and set the form values
    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("name")
        .eq("id", clientId)
        .single();
      
      if (!error && data) {
        form.setValue("client_name", data.name);
        form.setValue("client_id", clientId);
      }
    };
    
    fetchClient();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField 
        control={form.control} 
        name="note_number" 
        label="Note Number" 
        placeholder="Enter note number" 
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
        required 
      />
      
      <TextField 
        control={form.control} 
        name="client_name" 
        label="Client Name" 
        placeholder="Enter client name" 
        required 
      />
      
      <TextField 
        control={form.control} 
        name="batch_number" 
        label="Batch Number" 
        placeholder="Enter batch number" 
      />
      
      <TextField 
        control={form.control} 
        name="vehicle_number" 
        label="Vehicle Number" 
        placeholder="Enter vehicle number" 
      />
      
      <TextField 
        control={form.control} 
        name="transporter" 
        label="Transporter" 
        placeholder="Enter transporter name" 
      />
      
      <TextField 
        control={form.control} 
        name="loaded_by" 
        label="Loaded By" 
        placeholder="Enter loader name" 
      />
      
      <NumberField
        control={form.control}
        name="total_quantity"
        label="Total Quantity"
        placeholder="Enter total quantity"
        step="1"
        required
      />
      
      <div className="md:col-span-2">
        <TextareaField
          control={form.control}
          name="notes"
          label="Notes"
          placeholder="Enter additional notes"
        />
      </div>
    </div>
  );
}
