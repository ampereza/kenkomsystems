
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Save, Edit } from "lucide-react";

type PoleCategory = "telecom" | "timber" | "rafters" | "9m" | "10m" | "11m" | "12m" | "14m" | "16m";

interface PriceConfig {
  id: string;
  category: PoleCategory;
  purchase_price: number;
  treatment_price: number;
  sale_price: number;
  updated_at: string;
}

export function PricingManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [priceUpdates, setPriceUpdates] = useState<Record<string, Partial<PriceConfig>>>({});

  const { data: pricingData, isLoading } = useQuery({
    queryKey: ["pricing-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_config")
        .select("*")
        .order("category");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching pricing data",
          description: error.message,
        });
        throw error;
      }

      return data as PriceConfig[] || [];
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<PriceConfig> }) => {
      const { data, error } = await supabase
        .from("pricing_config")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-config"] });
      toast({
        title: "Price updated",
        description: "The price configuration has been updated successfully",
      });
      setEditMode({});
      setPriceUpdates({});
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    },
  });

  const toggleEditMode = (id: string) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));

    if (editMode[id]) {
      // Save changes
      if (priceUpdates[id]) {
        updatePriceMutation.mutate({ 
          id, 
          updates: priceUpdates[id] 
        });
      }
    }
  };

  const handlePriceChange = (id: string, field: keyof PriceConfig, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setPriceUpdates(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: numValue
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pole Pricing Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Purchase Price</TableHead>
              <TableHead>Treatment Price</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingData?.map((price) => (
              <TableRow key={price.id}>
                <TableCell className="font-medium capitalize">
                  {price.category.replace(/_/g, " ")}
                </TableCell>
                <TableCell>
                  {editMode[price.id] ? (
                    <Input 
                      type="number"
                      defaultValue={price.purchase_price}
                      onChange={(e) => handlePriceChange(price.id, "purchase_price", e.target.value)}
                      className="w-24"
                    />
                  ) : (
                    `$${price.purchase_price.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {editMode[price.id] ? (
                    <Input 
                      type="number"
                      defaultValue={price.treatment_price}
                      onChange={(e) => handlePriceChange(price.id, "treatment_price", e.target.value)}
                      className="w-24"
                    />
                  ) : (
                    `$${price.treatment_price.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {editMode[price.id] ? (
                    <Input 
                      type="number"
                      defaultValue={price.sale_price}
                      onChange={(e) => handlePriceChange(price.id, "sale_price", e.target.value)}
                      className="w-24"
                    />
                  ) : (
                    `$${price.sale_price.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {new Date(price.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleEditMode(price.id)}
                  >
                    {editMode[price.id] ? (
                      <><Save className="h-4 w-4 mr-1" /> Save</>
                    ) : (
                      <><Edit className="h-4 w-4 mr-1" /> Edit</>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
