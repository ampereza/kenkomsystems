import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ClientDeliveryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export function ClientDeliveryForm({ onSuccess, onCancel, initialData }: ClientDeliveryFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    client_id: '',
    treatment_id: '',
    delivery_date: new Date(),
    quantity: '',
    delivery_note: '',
    received_by: '',
    delivery_status: 'pending',
    remarks: ''
  });

  useEffect(() => {
    fetchClients();
    fetchTreatments();

    if (initialData) {
      setFormData({
        ...initialData,
        delivery_date: initialData.delivery_date ? new Date(initialData.delivery_date) : new Date(),
        quantity: initialData.quantity ? initialData.quantity.toString() : '',
      });
    }
  }, [initialData]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*');
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to load clients. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const fetchTreatments = async () => {
    try {
      const { data, error } = await supabase.from('treatments').select('*');
      if (error) throw error;
      setTreatments(data || []);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load treatments. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.client_id || !formData.treatment_id || !formData.delivery_date || !formData.quantity) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare data for submission
      const deliveryData = {
        client_id: formData.client_id,
        treatment_id: formData.treatment_id,
        delivery_date: formData.delivery_date.toISOString(),
        quantity: parseInt(formData.quantity),
        delivery_note: formData.delivery_note,
        received_by: formData.received_by,
        delivery_status: formData.delivery_status,
        remarks: formData.remarks,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (initialData?.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('treatments')
          .update(deliveryData)
          .eq('id', initialData.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Delivery record updated successfully',
        });
      } else {
        // Create new record
        const { data, error } = await supabase.from('treatments').insert(deliveryData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'New delivery record created successfully',
        });
      }

      // Reset form or call success callback
      if (onSuccess) onSuccess();
      else {
        setFormData({
          client_id: '',
          treatment_id: '',
          delivery_date: new Date(),
          quantity: '',
          delivery_note: '',
          received_by: '',
          delivery_status: 'pending',
          remarks: ''
        });
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save delivery record',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Delivery Record' : 'New Client Delivery'}</CardTitle>
        <CardDescription>
          {initialData 
            ? 'Update the details of this delivery record' 
            : 'Record a new delivery of treated poles to a client'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client</Label>
              <Select 
                value={formData.client_id} 
                onValueChange={(value) => handleChange('client_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment_id">Treatment Batch</Label>
              <Select 
                value={formData.treatment_id} 
                onValueChange={(value) => handleChange('treatment_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select treatment batch" />
                </SelectTrigger>
                <SelectContent>
                  {treatments.map((treatment) => (
                    <SelectItem key={treatment.id} value={treatment.id}>
                      Batch #{treatment.batch_number || treatment.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_date">Delivery Date</Label>
              <DatePicker
                date={formData.delivery_date}
                setDate={(date) => handleChange('delivery_date', date)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="Number of poles"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_note">Delivery Note #</Label>
              <Input
                id="delivery_note"
                value={formData.delivery_note}
                onChange={(e) => handleChange('delivery_note', e.target.value)}
                placeholder="Delivery note reference"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="received_by">Received By</Label>
              <Input
                id="received_by"
                value={formData.received_by}
                onChange={(e) => handleChange('received_by', e.target.value)}
                placeholder="Name of receiver"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_status">Status</Label>
              <Select 
                value={formData.delivery_status} 
                onValueChange={(value) => handleChange('delivery_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Additional notes or comments"
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Delivery' : 'Create Delivery'}
        </Button>
      </CardFooter>
    </Card>
  );
}
