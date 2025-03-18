
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StockNavbar } from "@/components/navigation/StockNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

export default function ViewSuppliers() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <StockNavbar />
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <Button asChild>
            <Link to="/suppliers/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading suppliers...</p>
          </div>
        ) : suppliers?.length === 0 ? (
          <Card className="w-full p-6 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">No suppliers found</p>
              <Button asChild>
                <Link to="/suppliers/add">Add Your First Supplier</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers?.map((supplier) => (
              <Card key={supplier.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{supplier.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Contact: {supplier.contact_person || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Phone: {supplier.phone || "N/A"}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/suppliers/edit/${supplier.id}`}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
