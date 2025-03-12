
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, 
} from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ClientDeliveryFormProps {
  treatmentId: string;
  clientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface DeliveryFormValues {
  delivery_date: Date;
  quantity: number;
  delivery_note: string;
  received_by: string;
  remarks: string;
}

export function ClientDeliveryForm({ treatmentId, clientId, onSuccess, onCancel }: ClientDeliveryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DeliveryFormValues>({
    defaultValues: {
      delivery_date: new Date(),
      quantity: 0,
      delivery_note: "",
      received_by: "",
      remarks: ""
    }
  });

  const onSubmit = async (data: DeliveryFormValues) => {
    try {
      setIsSubmitting(true);

      // Create delivery record in the new client_deliveries view
      const { error } = await supabase.from("client_deliveries").insert({
        treatment_id: treatmentId,
        client_id: clientId,
        delivery_date: format(data.delivery_date, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        quantity: data.quantity,
        delivery_note: data.delivery_note,
        received_by: data.received_by,
        remarks: data.remarks
      });

      if (error) throw error;

      toast.success("Delivery recorded successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error recording delivery:", error);
      toast.error("Failed to record delivery");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="delivery_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="delivery_note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Note Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="received_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Received By</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Recording..." : "Record Delivery"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
