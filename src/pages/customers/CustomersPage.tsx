
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("full_name", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredCustomers = customers?.filter(customer => 
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.telepnone?.includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => navigate("/customers/add_customer")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading customers...</div>
      ) : filteredCustomers && filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden">
              <CardHeader className="bg-purple-50 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{customer.full_name}</CardTitle>
                  <User className="h-5 w-5 text-purple-500" />
                </div>
                {customer.company_name && (
                  <p className="text-sm text-muted-foreground">{customer.company_name}</p>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {customer.telepnone && (
                    <p className="text-sm flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{customer.telepnone}</span>
                    </p>
                  )}
                  {customer.address && (
                    <p className="text-sm flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="text-right">{customer.address}</span>
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/customers/edit_customers?id=${customer.id}`)}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "No customers match your search" : "No customers found"}
        </div>
      )}
    </div>
  );
}
