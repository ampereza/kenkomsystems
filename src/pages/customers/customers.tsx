
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search, Edit, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Customers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }

      return data || [];
    },
  });

  const filteredCustomers = customers?.filter(customer => 
    (customer.full_name && customer.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.company_name && customer.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.address && customer.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.telepnone && customer.telepnone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <FinancialNavbar />
      <main className="container py-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/customers/add_customer">
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Add Customer
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading customers...</p>
            </div>
          </div>
        ) : filteredCustomers && filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Users className="h-5 w-5 text-primary/70" />
                      {customer.full_name || customer.company_name || "Unnamed Customer"}
                    </CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {customer.company_name ? "Company" : "Individual"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {customer.company_name && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Company:</span>{" "}
                        {customer.company_name}
                      </p>
                    )}
                    {customer.full_name && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Full Name:</span>{" "}
                        {customer.full_name}
                      </p>
                    )}
                    {customer.telepnone && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {customer.telepnone}
                      </p>
                    )}
                    {customer.address && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Address:</span>{" "}
                        {customer.address}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <CreditCard className="h-3.5 w-3.5 mr-1" /> Transactions
                    </Button>
                    <Link to={`/customers/edit_cutomers?id=${customer.id}`} className="flex-1">
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
            <Users className="h-12 w-12 mx-auto text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No customers found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? "Try a different search query" : "Add your first customer to get started"}
            </p>
            {!searchQuery && (
              <Link to="/customers/add_customer">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Customer
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
