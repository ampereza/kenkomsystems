
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Client } from "./types";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddClientStock = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [stockType, setStockType] = useState("untreated");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

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
      }
    };

    fetchClients();
  }, [toast]);

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
    const { error } = await supabase
      .from("client_stock")
      .insert({
        client_id: selectedClientId,
        stock_type: stockType,
        quantity: parseInt(quantity),
        description
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding stock",
        description: error.message
      });
    } else {
      toast({
        title: "Success",
        description: "Client stock added successfully"
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
            <CardTitle>Add Client Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="client" className="text-sm font-medium">Client</label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
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

              <div className="space-y-2">
                <label htmlFor="stockType" className="text-sm font-medium">Stock Type</label>
                <Select value={stockType} onValueChange={setStockType}>
                  <SelectTrigger id="stockType">
                    <SelectValue placeholder="Select stock type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="untreated">Untreated</SelectItem>
                    <SelectItem value="treated">Treated</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Stock"}
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

export default AddClientStock;
