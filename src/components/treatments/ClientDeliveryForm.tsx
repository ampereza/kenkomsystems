
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

interface ClientDeliveryFormProps {
  clientId: string;
  treatmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClientDeliveryForm({ 
  clientId,
  treatmentId,
  onSuccess,
  onCancel 
}: ClientDeliveryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [formData, setFormData] = useState({
    quantity: '',
    deliveryNote: '',
    receivedBy: '',
    remarks: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert into client_deliveries table
      const { error } = await supabase
        .from('client_deliveries')
        .insert({
          client_id: clientId,
          treatment_id: treatmentId,
          delivery_date: deliveryDate?.toISOString(),
          quantity: parseInt(formData.quantity),
          delivery_note: formData.deliveryNote,
          received_by: formData.receivedBy,
          remarks: formData.remarks
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery recorded successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error recording delivery:', error);
      toast({
        title: "Error",
        description: "Failed to record delivery",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="deliveryDate">Delivery Date</Label>
        <DatePicker 
          date={deliveryDate} 
          setDate={setDeliveryDate}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="deliveryNote">Delivery Note Number</Label>
        <Input
          id="deliveryNote"
          value={formData.deliveryNote}
          onChange={(e) => setFormData(prev => ({ ...prev, deliveryNote: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="receivedBy">Received By</Label>
        <Input
          id="receivedBy"
          value={formData.receivedBy}
          onChange={(e) => setFormData(prev => ({ ...prev, receivedBy: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record Delivery"}
        </Button>
      </div>
    </form>
  );
}
