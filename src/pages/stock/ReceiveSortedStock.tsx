
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface FormData {
  sorted_stock_id: string;
  quantity: string;
  notes: string;
}

const ReceiveSortedStock = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    sorted_stock_id: "",
    quantity: "",
    notes: "",
  });

  const { data: sortedStocks } = useQuery({
    queryKey: ["sorted-stocks-available"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sorted_stock")
        .select("*, suppliers(name)")
        .neq("category", "rejected")
        .order("sorting_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.sorted_stock_id || !formData.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("received_sorted_stock").insert({
        sorted_stock_id: formData.sorted_stock_id,
        quantity: parseInt(formData.quantity),
        notes: formData.notes || null,
        processing_status: "completed",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock received successfully",
      });

      // Reset form
      setFormData({
        sorted_stock_id: "",
        quantity: "",
        notes: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to receive stock",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Receive Sorted Stock</h1>
        <p className="mt-2 text-muted-foreground">
          Record received sorted poles
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sorted Stock*</label>
          <Select
            value={formData.sorted_stock_id}
            onValueChange={(value) =>
              setFormData({ ...formData, sorted_stock_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sorted stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sortedStocks?.map((stock) => (
                  <SelectItem key={stock.id} value={stock.id}>
                    {stock.quantity} {stock.category} poles - {stock.size || "N/A"}{" "}
                    ({new Date(stock.sorting_date).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="quantity">
            Quantity*
          </label>
          <Input
            id="quantity"
            type="number"
            required
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="notes">
            Notes
          </label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Receive Stock"}
        </Button>
      </form>
    </div>
  );
};

export default ReceiveSortedStock;
