
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ClientDeliveryFormProps {
  onSuccess?: () => void;
  clientId?: string;
}

export function ClientDeliveryForm({ onSuccess, clientId }: ClientDeliveryFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | undefined>(clientId);
  const [formData, setFormData] = useState({
    telecom_poles: "0",
    poles_9m: "0",
    poles_10m: "0",
    poles_11m: "0",
    poles_12m: "0",
    poles_14m: "0",
    poles_16m: "0",
    delivery_note_number: "",
    notes: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");

      if (error) {
        toast({
          title: "Error fetching clients",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setClients(data || []);
    };

    fetchClients();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClientChange = (value: string) => {
    setSelectedClient(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClient) {
      toast({
        title: "Client selection required",
        description: "Please select a client before submitting",
        variant: "destructive",
      });
      return;
    }

    // Check if at least one pole is being delivered
    const hasPoles = Object.entries(formData)
      .filter(([key]) => key.includes("poles"))
      .some(([_, value]) => parseInt(value, 10) > 0);

    if (!hasPoles) {
      toast({
        title: "No poles selected",
        description: "Please specify at least one pole for delivery",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Convert string values to integers for pole quantities
    const processedData = {
      client_id: selectedClient,
      telecom_poles: parseInt(formData.telecom_poles, 10) || 0,
      poles_9m: parseInt(formData.poles_9m, 10) || 0,
      poles_10m: parseInt(formData.poles_10m, 10) || 0,
      poles_11m: parseInt(formData.poles_11m, 10) || 0,
      poles_12m: parseInt(formData.poles_12m, 10) || 0,
      poles_14m: parseInt(formData.poles_14m, 10) || 0,
      poles_16m: parseInt(formData.poles_16m, 10) || 0,
      delivery_note_number: formData.delivery_note_number,
      notes: formData.notes,
    };

    try {
      // Check if the client has enough treated stock
      const { data: clientStock, error: stockError } = await supabase
        .from("client_stock")
        .select("*")
        .eq("client_id", selectedClient)
        .single();

      if (stockError) {
        if (stockError.code === "PGRST116") {
          // No stock record found
          toast({
            title: "No stock record",
            description: "This client doesn't have a stock record. Please add stock first.",
            variant: "destructive",
          });
          return;
        }
        throw stockError;
      }

      // Check if client has enough treated stock for each pole type
      const insufficientStock = [];
      if (processedData.telecom_poles > clientStock.treated_telecom_poles) {
        insufficientStock.push("Telecom poles");
      }
      if (processedData.poles_9m > clientStock.treated_9m_poles) {
        insufficientStock.push("9m poles");
      }
      if (processedData.poles_10m > clientStock.treated_10m_poles) {
        insufficientStock.push("10m poles");
      }
      if (processedData.poles_11m > clientStock.treated_11m_poles) {
        insufficientStock.push("11m poles");
      }
      if (processedData.poles_12m > clientStock.treated_12m_poles) {
        insufficientStock.push("12m poles");
      }
      if (processedData.poles_14m > clientStock.treated_14m_poles) {
        insufficientStock.push("14m poles");
      }
      if (processedData.poles_16m > clientStock.treated_16m_poles) {
        insufficientStock.push("16m poles");
      }

      if (insufficientStock.length > 0) {
        toast({
          title: "Insufficient treated stock",
          description: `Client does not have enough: ${insufficientStock.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      // Insert delivery record
      const { error: insertError } = await supabase
        .from("client_deliveries")
        .insert(processedData);

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Delivery recorded successfully",
        description: "The client delivery has been recorded",
      });

      // Reset form
      setFormData({
        telecom_poles: "0",
        poles_9m: "0",
        poles_10m: "0",
        poles_11m: "0",
        poles_12m: "0",
        poles_14m: "0",
        poles_16m: "0",
        delivery_note_number: "",
        notes: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error recording delivery",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Record Client Delivery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="client" className="block text-sm font-medium mb-1">
              Client *
            </label>
            <Select value={selectedClient} onValueChange={handleClientChange} disabled={!!clientId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a client" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-full">
              <h3 className="font-medium mb-2">Delivery Quantities</h3>
            </div>
            
            <div>
              <label htmlFor="telecom_poles" className="block text-sm font-medium mb-1">
                Telecom Poles
              </label>
              <Input
                id="telecom_poles"
                name="telecom_poles"
                type="number"
                min="0"
                value={formData.telecom_poles}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="poles_9m" className="block text-sm font-medium mb-1">
                9m Poles
              </label>
              <Input
                id="poles_9m"
                name="poles_9m"
                type="number"
                min="0"
                value={formData.poles_9m}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="poles_10m" className="block text-sm font-medium mb-1">
                10m Poles
              </label>
              <Input
                id="poles_10m"
                name="poles_10m"
                type="number"
                min="0"
                value={formData.poles_10m}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="poles_11m" className="block text-sm font-medium mb-1">
                11m Poles
              </label>
              <Input
                id="poles_11m"
                name="poles_11m"
                type="number"
                min="0"
                value={formData.poles_11m}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="poles_12m" className="block text-sm font-medium mb-1">
                12m Poles
              </label>
              <Input
                id="poles_12m"
                name="poles_12m"
                type="number"
                min="0"
                value={formData.poles_12m}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="poles_14m" className="block text-sm font-medium mb-1">
                14m Poles
              </label>
              <Input
                id="poles_14m"
                name="poles_14m"
                type="number"
                min="0"
                value={formData.poles_14m}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="poles_16m" className="block text-sm font-medium mb-1">
                16m Poles
              </label>
              <Input
                id="poles_16m"
                name="poles_16m"
                type="number"
                min="0"
                value={formData.poles_16m}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="delivery_note_number" className="block text-sm font-medium mb-1">
                Delivery Note Number
              </label>
              <Input
                id="delivery_note_number"
                name="delivery_note_number"
                value={formData.delivery_note_number}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Delivery"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
