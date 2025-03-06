
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Truck, AlertTriangle, ClipboardCheck } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ClientDeliveryFormProps {
  onSuccess?: () => void;
  clientId?: string;
}

// Define a type for the form data
interface FormData {
  telecom_poles: string;
  "9m_poles": string;
  "10m_poles": string;
  "11m_poles": string;
  "12m_poles": string;
  "14m_poles": string;
  "16m_poles": string;
  notes: string;
  reference: string;
}

export function ClientDeliveryForm({ onSuccess, clientId }: ClientDeliveryFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { clients, isLoading: clientsLoading } = useClients();
  const [selectedClient, setSelectedClient] = useState<string | undefined>(clientId);
  const [formData, setFormData] = useState<FormData>({
    telecom_poles: "0",
    "9m_poles": "0",
    "10m_poles": "0",
    "11m_poles": "0",
    "12m_poles": "0",
    "14m_poles": "0",
    "16m_poles": "0",
    notes: "",
    reference: "",
  });
  const [clientStock, setClientStock] = useState<Record<string, any> | null>(null);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  useEffect(() => {
    // Update selected client when clientId prop changes
    if (clientId) {
      setSelectedClient(clientId);
      fetchClientStock(clientId);
    }
  }, [clientId]);

  useEffect(() => {
    if (selectedClient) {
      fetchClientStock(selectedClient);
    }
  }, [selectedClient]);

  const fetchClientStock = async (clientId: string) => {
    setIsLoadingStock(true);
    try {
      const { data, error } = await supabase
        .from("client_stock")
        .select("*")
        .eq("client_id", clientId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setClientStock(data || null);
    } catch (error: any) {
      console.error("Error fetching client stock:", error);
      toast({
        title: "Error fetching client stock",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingStock(false);
    }
  };

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

  const hasAnyPoles = () => {
    return Object.entries(formData)
      .filter(([key]) => key !== "notes" && key !== "reference")
      .some(([_, value]) => parseInt(value) > 0);
  };

  const validateStock = () => {
    if (!clientStock) return false;
    
    // Check if client has enough treated poles
    const hasSufficientStock = Object.entries(formData)
      .filter(([key]) => key !== "notes" && key !== "reference")
      .every(([key, value]) => {
        const stockKey = `treated_${key}`;
        const requestedQuantity = parseInt(value) || 0;
        const availableQuantity = clientStock[stockKey] || 0;
        return requestedQuantity <= availableQuantity;
      });
      
    return hasSufficientStock;
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

    if (!hasAnyPoles()) {
      toast({
        title: "No poles selected",
        description: "Please enter at least one pole quantity",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateStock()) {
      toast({
        title: "Insufficient stock",
        description: "Client doesn't have enough treated poles in stock",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Convert string values to integers
    const processedData: Record<string, any> = Object.entries(formData).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: key === "notes" || key === "reference" ? value : (parseInt(value) || 0),
      }),
      {}
    );

    try {
      // Check if client stock exists
      if (!clientStock) {
        toast({
          title: "No stock found",
          description: "This client doesn't have any stock to deliver",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Prepare update data - move poles from treated to delivered
      const updateData: Record<string, any> = {};
      
      Object.entries(processedData)
        .filter(([key]) => key !== "notes" && key !== "reference")
        .forEach(([key, value]) => {
          const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
          if (numValue > 0) {
            const treatedKey = `treated_${key}`;
            const deliveredKey = `delivered_${key}`;
            
            // Decrease treated poles
            updateData[treatedKey] = Math.max(0, (clientStock[treatedKey] || 0) - numValue);
            
            // Increase delivered poles
            updateData[deliveredKey] = (clientStock[deliveredKey] || 0) + numValue;
          }
        });

      // Update client stock
      const { error: updateError } = await supabase
        .from("client_stock")
        .update(updateData)
        .eq("id", clientStock.id);

      if (updateError) {
        throw updateError;
      }
      
      // Create delivery record
      const { error: deliveryError } = await supabase
        .from("client_deliveries")
        .insert({
          client_id: selectedClient,
          delivery_date: new Date().toISOString(),
          telecom_poles: processedData.telecom_poles || 0,
          "9m_poles": processedData["9m_poles"] || 0,
          "10m_poles": processedData["10m_poles"] || 0,
          "11m_poles": processedData["11m_poles"] || 0,
          "12m_poles": processedData["12m_poles"] || 0,
          "14m_poles": processedData["14m_poles"] || 0,
          "16m_poles": processedData["16m_poles"] || 0,
          notes: processedData.notes || null,
          reference: processedData.reference || null
        });

      if (deliveryError) {
        throw deliveryError;
      }

      toast({
        title: "Delivery recorded successfully",
        description: "The client delivery has been recorded",
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

  const getSelectedClientName = () => {
    if (!selectedClient || clientsLoading) return "Loading...";
    const client = clients.find(c => c.id === selectedClient);
    return client ? client.name : "Select a client";
  };

  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Truck className="h-5 w-5 text-slate-600" /> Record Client Delivery
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="client" className="block text-sm font-medium text-slate-700 mb-1">
              Client {!clientId && <span className="text-rose-500">*</span>}
            </label>
            <Select value={selectedClient} onValueChange={handleClientChange} disabled={!!clientId}>
              <SelectTrigger className="w-full bg-white border-slate-200 focus:ring-slate-200 cursor-pointer">
                <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client"}>
                  {getSelectedClientName()}
                </SelectValue>
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

          {isLoadingStock ? (
            <div className="py-8 text-center bg-slate-50 rounded-md border border-slate-100">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-500" />
              <p className="mt-2 text-sm text-slate-600">Loading client stock...</p>
            </div>
          ) : (
            <>
              {clientStock ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Pole selection section */}
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                    <h3 className="font-medium text-slate-800 mb-2 flex items-center">
                      <ClipboardCheck className="h-4 w-4 mr-2 text-slate-600" />
                      Poles to Deliver
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Enter the quantity of treated poles to be delivered
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <label htmlFor="telecom_poles" className="block text-sm font-medium mb-1 text-slate-700">
                          Telecom Poles
                          <Badge variant="outline" className="ml-2 font-normal">
                            Available: {clientStock.treated_telecom_poles || 0}
                          </Badge>
                        </label>
                        <Input
                          id="telecom_poles"
                          name="telecom_poles"
                          type="number"
                          min="0"
                          max={clientStock.treated_telecom_poles || 0}
                          value={formData.telecom_poles}
                          onChange={handleInputChange}
                          className="cursor-text border-slate-200 focus:border-slate-300"
                        />
                      </div>
                      
                      <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <label htmlFor="9m_poles" className="block text-sm font-medium mb-1 text-slate-700">
                          9m Poles
                          <Badge variant="outline" className="ml-2 font-normal">
                            Available: {clientStock.treated_9m_poles || 0}
                          </Badge>
                        </label>
                        <Input
                          id="9m_poles"
                          name="9m_poles"
                          type="number"
                          min="0"
                          max={clientStock.treated_9m_poles || 0}
                          value={formData["9m_poles"]}
                          onChange={handleInputChange}
                          className="cursor-text border-slate-200 focus:border-slate-300"
                        />
                      </div>
                      
                      <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <label htmlFor="10m_poles" className="block text-sm font-medium mb-1 text-slate-700">
                          10m Poles
                          <Badge variant="outline" className="ml-2 font-normal">
                            Available: {clientStock.treated_10m_poles || 0}
                          </Badge>
                        </label>
                        <Input
                          id="10m_poles"
                          name="10m_poles"
                          type="number"
                          min="0"
                          max={clientStock.treated_10m_poles || 0}
                          value={formData["10m_poles"]}
                          onChange={handleInputChange}
                          className="cursor-text border-slate-200 focus:border-slate-300"
                        />
                      </div>
                      
                      <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <label htmlFor="11m_poles" className="block text-sm font-medium mb-1 text-slate-700">
                          11m Poles
                          <Badge variant="outline" className="ml-2 font-normal">
                            Available: {clientStock.treated_11m_poles || 0}
                          </Badge>
                        </label>
                        <Input
                          id="11m_poles"
                          name="11m_poles"
                          type="number"
                          min="0"
                          max={clientStock.treated_11m_poles || 0}
                          value={formData["11m_poles"]}
                          onChange={handleInputChange}
                          className="cursor-text border-slate-200 focus:border-slate-300"
                        />
                      </div>
                      
                      <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <label htmlFor="12m_poles" className="block text-sm font-medium mb-1 text-slate-700">
                          12m Poles
                          <Badge variant="outline" className="ml-2 font-normal">
                            Available: {clientStock.treated_12m_poles || 0}
                          </Badge>
                        </label>
                        <Input
                          id="12m_poles"
                          name="12m_poles"
                          type="number"
                          min="0"
                          max={clientStock.treated_12m_poles || 0}
                          value={formData["12m_poles"]}
                          onChange={handleInputChange}
                          className="cursor-text border-slate-200 focus:border-slate-300"
                        />
                      </div>
                      
                      <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <label htmlFor="14m_poles" className="block text-sm font-medium mb-1 text-slate-700">
                          14m Poles
                          <Badge variant="outline" className="ml-2 font-normal">
                            Available: {clientStock.treated_14m_poles || 0}
                          </Badge>
                        </label>
                        <Input
                          id="14m_poles"
                          name="14m_poles"
                          type="number"
                          min="0"
                          max={clientStock.treated_14m_poles || 0}
                          value={formData["14m_poles"]}
                          onChange={handleInputChange}
                          className="cursor-text border-slate-200 focus:border-slate-300"
                        />
                      </div>
                      
                      <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
                        <label htmlFor="16m_poles" className="block text-sm font-medium mb-1 text-slate-700">
                          16m Poles
                          <Badge variant="outline" className="ml-2 font-normal">
                            Available: {clientStock.treated_16m_poles || 0}
                          </Badge>
                        </label>
                        <Input
                          id="16m_poles"
                          name="16m_poles"
                          type="number"
                          min="0"
                          max={clientStock.treated_16m_poles || 0}
                          value={formData["16m_poles"]}
                          onChange={handleInputChange}
                          className="cursor-text border-slate-200 focus:border-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Reference section */}
                  <div className="bg-white p-4 rounded-md border border-slate-200">
                    <label htmlFor="reference" className="block text-sm font-medium mb-2 text-slate-700">
                      Reference Number (Optional)
                    </label>
                    <Input
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="Enter delivery reference number"
                      className="cursor-text border-slate-200 focus:border-slate-300"
                    />
                  </div>
                  
                  {/* Notes section */}
                  <div className="bg-white p-4 rounded-md border border-slate-200">
                    <label htmlFor="notes" className="block text-sm font-medium mb-2 text-slate-700">
                      Notes (Optional)
                    </label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes about this delivery"
                      rows={3}
                      className="cursor-text border-slate-200 focus:border-slate-300 resize-none"
                    />
                  </div>
                </div>
              ) : (
                selectedClient && (
                  <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      No stock found for this client. Please add stock for this client before recording deliveries.
                    </AlertDescription>
                  </Alert>
                )
              )}
            </>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button 
              type="submit" 
              disabled={isLoading || isLoadingStock || !selectedClient || !clientStock}
              className={cn(
                "min-w-[160px] cursor-pointer",
                isLoading ? "bg-slate-700" : "bg-slate-800 hover:bg-slate-700"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording Delivery...
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  Record Delivery
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
