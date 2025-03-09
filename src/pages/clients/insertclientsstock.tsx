
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "./types";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InsertClientStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  // State for pole quantities
  const [untreatedTelecomPoles, setUntreatedTelecomPoles] = useState(0);
  const [untreated9mPoles, setUntreated9mPoles] = useState(0);
  const [untreated10mPoles, setUntreated10mPoles] = useState(0);
  const [untreated11mPoles, setUntreated11mPoles] = useState(0);
  const [untreated12mPoles, setUntreated12mPoles] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching clients",
          description: error.message
        });
      } else {
        setClients(data || []);
        
        // Check if we have a client ID in the URL
        const clientId = new URLSearchParams(location.search).get("id");
        if (clientId) {
          setSelectedClientId(clientId);
        }
      }
    };

    fetchClients();
  }, [location.search, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a client"
      });
      return;
    }

    setLoading(true);
    
    // First check if a client_stock entry already exists
    const { data: existingStock, error: queryError } = await supabase
      .from("client_stock")
      .select("*")
      .eq("client_id", selectedClientId)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') {
      // Error code PGRST116 is "No rows found" which is expected if the client has no stock yet
      toast({
        variant: "destructive",
        title: "Error checking client stock",
        description: queryError.message
      });
      setLoading(false);
      return;
    }
    
    let result;
    if (existingStock) {
      // Update existing stock
      result = await supabase
        .from("client_stock")
        .update({
          untreated_telecom_poles: untreatedTelecomPoles,
          untreated_9m_poles: untreated9mPoles,
          untreated_10m_poles: untreated10mPoles,
          untreated_11m_poles: untreated11mPoles,
          untreated_12m_poles: untreated12mPoles,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingStock.id);
    } else {
      // Insert new stock
      result = await supabase
        .from("client_stock")
        .insert({
          client_id: selectedClientId,
          untreated_telecom_poles: untreatedTelecomPoles,
          untreated_9m_poles: untreated9mPoles,
          untreated_10m_poles: untreated10mPoles,
          untreated_11m_poles: untreated11mPoles,
          untreated_12m_poles: untreated12mPoles,
          notes
        });
    }

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error saving client stock",
        description: result.error.message
      });
    } else {
      toast({
        title: "Success",
        description: "Client stock saved successfully"
      });
      navigate("/clients/clients");
    }
    setLoading(false);
  };

  return (
    <>
      <FinancialNavbar />
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Insert Client Stock Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="client" className="text-sm font-medium">Client</label>
                <Select 
                  value={selectedClientId} 
                  onValueChange={setSelectedClientId}
                  disabled={!!location.search.includes('id=')}
                >
                  <SelectTrigger id="client">
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
                <div className="space-y-2">
                  <label htmlFor="untreatedTelecomPoles" className="text-sm font-medium">Untreated Telecom Poles</label>
                  <Input
                    id="untreatedTelecomPoles"
                    type="number"
                    value={untreatedTelecomPoles}
                    onChange={(e) => setUntreatedTelecomPoles(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="untreated9mPoles" className="text-sm font-medium">Untreated 9m Poles</label>
                  <Input
                    id="untreated9mPoles"
                    type="number"
                    value={untreated9mPoles}
                    onChange={(e) => setUntreated9mPoles(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="untreated10mPoles" className="text-sm font-medium">Untreated 10m Poles</label>
                  <Input
                    id="untreated10mPoles"
                    type="number"
                    value={untreated10mPoles}
                    onChange={(e) => setUntreated10mPoles(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="untreated11mPoles" className="text-sm font-medium">Untreated 11m Poles</label>
                  <Input
                    id="untreated11mPoles"
                    type="number"
                    value={untreated11mPoles}
                    onChange={(e) => setUntreated11mPoles(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="untreated12mPoles" className="text-sm font-medium">Untreated 12m Poles</label>
                  <Input
                    id="untreated12mPoles"
                    type="number"
                    value={untreated12mPoles}
                    onChange={(e) => setUntreated12mPoles(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Stock"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/clients/clients")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InsertClientStock;
