
import { useState, useEffect } from "react";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Client } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function EditClient() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [clientData, setClientData] = useState<Client>({
    id: 0,
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    created_at: "",
  });

  // Extract client ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("id");

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No client ID provided",
        });
        navigate("/clients/clients");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("id", clientId)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Client not found",
          });
          navigate("/clients/clients");
          return;
        }

        setClientData(data);
      } catch (error) {
        console.error("Error fetching client:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load client data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [clientId, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: clientData.name,
          contact_person: clientData.contact_person,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          notes: clientData.notes,
        })
        .eq("id", clientData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client updated successfully",
      });

      navigate("/clients/clients");
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update client",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <FinancialNavbar />
        <main className="container py-6 flex-1 flex items-center justify-center">
          <p>Loading client data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <FinancialNavbar />
      <main className="container py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Client</h1>
          <p className="text-muted-foreground">Update client information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Client Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={clientData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input 
                    id="contact_person" 
                    name="contact_person" 
                    value={clientData.contact_person || ""} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={clientData.email || ""} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={clientData.phone || ""} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={clientData.address || ""} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    value={clientData.notes || ""} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/clients/clients")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Update Client"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
