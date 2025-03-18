
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Clients() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching clients",
          description: error.message,
        });
        throw error;
      }

      return data || [];
    },
  });

  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.contact_person && client.contact_person.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="container py-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/clients/add_clients_stock">
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Add Client
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading clients...</p>
            </div>
          </div>
        ) : filteredClients && filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="h-5 w-5 text-primary/70" />
                    {client.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {client.contact_person && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Contact Person:</span>{" "}
                        {client.contact_person}
                      </p>
                    )}
                    {client.email && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {client.email}
                      </p>
                    )}
                    {client.phone && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {client.phone}
                      </p>
                    )}
                    {client.address && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Address:</span>{" "}
                        {client.address}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to={`/clients/view_clients_stock?id=${client.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </Link>
                    <Link to={`/clients/edit_client?id=${client.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No clients found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? "Try a different search query" : "Add your first client to get started"}
            </p>
            {!searchQuery && (
              <Link to="/clients/add_clients_stock">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Client
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
