
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package } from "lucide-react";
import { useClients } from "@/hooks/useClients";

interface ClientStockFormProps {
  onSuccess?: () => void;
  clientId?: string;
}

export function ClientStockForm({ onSuccess, clientId }: ClientStockFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { clients, isLoading: clientsLoading } = useClients();
  const [selectedClient, setSelectedClient] = useState<string | undefined>(clientId);
  const [formData, setFormData] = useState({
    untreated_telecom_poles: "0",
    untreated_9m_poles: "0",
    untreated_10m_poles: "0",
    untreated_11m_poles: "0",
    untreated_12m_poles: "0",
    untreated_14m_poles: "0",
    untreated_16m_poles: "0",
    
    treated_telecom_poles: "0",
    treated_9m_poles: "0",
    treated_10m_poles: "0",
    treated_11m_poles: "0",
    treated_12m_poles: "0",
    treated_14m_poles: "0",
    treated_16m_poles: "0",
  });

  useEffect(() => {
    // Update selected client when clientId prop changes
    if (clientId) {
      setSelectedClient(clientId);
      fetchExistingStock(clientId);
    }
  }, [clientId]);

  const fetchExistingStock = async (clientId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("client_poles_stock")
        .select("*")
        .eq("client_id", clientId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        // Format the data for the form
        const formattedData = Object.entries(data).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: key !== "id" && key !== "client_id" ? 
              value !== null ? value.toString() : "0" : 
              value
          }),
          {}
        );
        
        setFormData((prev) => ({
          ...prev,
          ...formattedData
        }));
      }
    } catch (error: any) {
      toast({
        title: "Error fetching client stock",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClientChange = (value: string) => {
    setSelectedClient(value);
    fetchExistingStock(value);
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

    setIsLoading(true);

    // Convert string values to integers
    const processedData = Object.entries(formData).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: parseInt(value, 10) || 0,
      }),
      {}
    );

    try {
      // Check if client stock already exists
      const { data: existingStock, error: checkError } = await supabase
        .from("client_poles_stock")
        .select("id")
        .eq("client_id", selectedClient)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      let result;

      if (existingStock) {
        // Update existing stock
        result = await supabase
          .from("client_poles_stock")
          .update({
            ...processedData,
            client_id: selectedClient
          })
          .eq("id", existingStock.id);
      } else {
        // Insert new stock record
        result = await supabase
          .from("client_poles_stock")
          .insert({
            client_id: selectedClient,
            ...processedData,
            quantity: 1 // Adding required field
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Stock updated successfully",
        description: "The client stock has been updated",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error updating stock",
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
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" /> Update Client Stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="client" className="block text-sm font-medium mb-1">
              Client *
            </label>
            <Select 
              value={selectedClient} 
              onValueChange={handleClientChange} 
              disabled={!!clientId || isLoading}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client"} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id} className="cursor-pointer">
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-full">
              <h3 className="font-medium mb-2">Untreated Poles</h3>
            </div>
            
            <div>
              <label htmlFor="untreated_telecom_poles" className="block text-sm font-medium mb-1">
                Telecom Poles
              </label>
              <Input
                id="untreated_telecom_poles"
                name="untreated_telecom_poles"
                type="number"
                min="0"
                value={formData.untreated_telecom_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="untreated_9m_poles" className="block text-sm font-medium mb-1">
                9m Poles
              </label>
              <Input
                id="untreated_9m_poles"
                name="untreated_9m_poles"
                type="number"
                min="0"
                value={formData.untreated_9m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="untreated_10m_poles" className="block text-sm font-medium mb-1">
                10m Poles
              </label>
              <Input
                id="untreated_10m_poles"
                name="untreated_10m_poles"
                type="number"
                min="0"
                value={formData.untreated_10m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="untreated_11m_poles" className="block text-sm font-medium mb-1">
                11m Poles
              </label>
              <Input
                id="untreated_11m_poles"
                name="untreated_11m_poles"
                type="number"
                min="0"
                value={formData.untreated_11m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="untreated_12m_poles" className="block text-sm font-medium mb-1">
                12m Poles
              </label>
              <Input
                id="untreated_12m_poles"
                name="untreated_12m_poles"
                type="number"
                min="0"
                value={formData.untreated_12m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="untreated_14m_poles" className="block text-sm font-medium mb-1">
                14m Poles
              </label>
              <Input
                id="untreated_14m_poles"
                name="untreated_14m_poles"
                type="number"
                min="0"
                value={formData.untreated_14m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="untreated_16m_poles" className="block text-sm font-medium mb-1">
                16m Poles
              </label>
              <Input
                id="untreated_16m_poles"
                name="untreated_16m_poles"
                type="number"
                min="0"
                value={formData.untreated_16m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div className="col-span-full mt-4">
              <h3 className="font-medium mb-2">Treated Poles</h3>
            </div>
            
            <div>
              <label htmlFor="treated_telecom_poles" className="block text-sm font-medium mb-1">
                Telecom Poles
              </label>
              <Input
                id="treated_telecom_poles"
                name="treated_telecom_poles"
                type="number"
                min="0"
                value={formData.treated_telecom_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="treated_9m_poles" className="block text-sm font-medium mb-1">
                9m Poles
              </label>
              <Input
                id="treated_9m_poles"
                name="treated_9m_poles"
                type="number"
                min="0"
                value={formData.treated_9m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="treated_10m_poles" className="block text-sm font-medium mb-1">
                10m Poles
              </label>
              <Input
                id="treated_10m_poles"
                name="treated_10m_poles"
                type="number"
                min="0"
                value={formData.treated_10m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="treated_11m_poles" className="block text-sm font-medium mb-1">
                11m Poles
              </label>
              <Input
                id="treated_11m_poles"
                name="treated_11m_poles"
                type="number"
                min="0"
                value={formData.treated_11m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="treated_12m_poles" className="block text-sm font-medium mb-1">
                12m Poles
              </label>
              <Input
                id="treated_12m_poles"
                name="treated_12m_poles"
                type="number"
                min="0"
                value={formData.treated_12m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="treated_14m_poles" className="block text-sm font-medium mb-1">
                14m Poles
              </label>
              <Input
                id="treated_14m_poles"
                name="treated_14m_poles"
                type="number"
                min="0"
                value={formData.treated_14m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
            
            <div>
              <label htmlFor="treated_16m_poles" className="block text-sm font-medium mb-1">
                16m Poles
              </label>
              <Input
                id="treated_16m_poles"
                name="treated_16m_poles"
                type="number"
                min="0"
                value={formData.treated_16m_poles}
                onChange={handleInputChange}
                className="cursor-text"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Stock"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
