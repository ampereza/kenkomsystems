
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Client } from "./types";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const EditClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [client, setClient] = useState<Client>({
    id: "",
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    created_at: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      const clientId = new URLSearchParams(location.search).get("id");
      if (!clientId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No client ID provided"
        });
        navigate("/clients/clients");
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching client",
          description: error.message
        });
        navigate("/clients/clients");
      } else if (data) {
        setClient(data as Client);
      }
      setLoading(false);
    };

    fetchClient();
  }, [location.search, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("clients")
      .update({
        name: client.name,
        contact_person: client.contact_person,
        email: client.email,
        phone: client.phone,
        address: client.address,
        notes: client.notes
      })
      .eq("id", client.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating client",
        description: error.message
      });
    } else {
      toast({
        title: "Success",
        description: "Client updated successfully"
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
            <CardTitle>Edit Client</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={client.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact_person" className="text-sm font-medium">Contact Person</label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    value={client.contact_person || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={client.email || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input
                    id="phone"
                    name="phone"
                    value={client.phone || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Address</label>
                  <Input
                    id="address"
                    name="address"
                    value={client.address || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={client.notes || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Client"}
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
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditClient;
