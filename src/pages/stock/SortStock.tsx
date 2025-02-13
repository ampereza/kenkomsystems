
import { useState, useEffect } from "react";
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

type PoleCategory = "fencing" | "telecom" | "distribution" | "high_voltage" | "rejected";
type PoleSize = "small" | "medium" | "stout";
type LengthUnit = "ft" | "m";

const categories: { value: PoleCategory; label: string }[] = [
  { value: "fencing", label: "Fencing Poles" },
  { value: "telecom", label: "Telecom Poles" },
  { value: "distribution", label: "Distribution Poles" },
  { value: "high_voltage", label: "High Voltage Poles" },
  { value: "rejected", label: "Rejected Poles" },
];

const sizes: { value: PoleSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "stout", label: "Stout" },
];

interface UnsortedStock {
  id: string;
  quantity: number;
  supplier_id: string | null;
  received_date: string;
  notes: string | null;
  created_at: string | null;
}

interface FormData {
  unsorted_stock_id: string;
  category: PoleCategory | "";
  size: PoleSize | "";
  length_value: string;
  length_unit: LengthUnit | "";
  diameter_mm: string;
  quantity: string;
  notes: string;
}

const SortStock = () => {
  const { toast } = useToast();
  const [unsortedStocks, setUnsortedStocks] = useState<UnsortedStock[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    unsorted_stock_id: "",
    category: "",
    size: "",
    length_value: "",
    length_unit: "",
    diameter_mm: "",
    quantity: "",
    notes: "",
  });

  useEffect(() => {
    fetchUnsortedStock();
  }, []);

  const fetchUnsortedStock = async () => {
    const { data, error } = await supabase
      .from("unsorted_stock")
      .select("*, suppliers(name)")
      .order("received_date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch unsorted stock",
        variant: "destructive",
      });
      return;
    }

    setUnsortedStocks(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.category || (!formData.size && formData.category !== "rejected") || !formData.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const insertData = {
        unsorted_stock_id: formData.unsorted_stock_id,
        category: formData.category,
        size: formData.category === "rejected" ? null : formData.size,
        length_value: formData.category === "rejected" ? null : parseFloat(formData.length_value),
        length_unit: formData.category === "rejected" ? null : formData.length_unit,
        diameter_mm: formData.category === "rejected" ? null : (formData.diameter_mm ? parseInt(formData.diameter_mm) : null),
        quantity: parseInt(formData.quantity),
        notes: formData.notes || null,
      };

      const { error } = await supabase.from("sorted_stock").insert(insertData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock sorted successfully",
      });

      // Reset form
      setFormData({
        unsorted_stock_id: "",
        category: "",
        size: "",
        length_value: "",
        length_unit: "",
        diameter_mm: "",
        quantity: "",
        notes: "",
      });

      // Refresh unsorted stock list
      fetchUnsortedStock();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sort stock",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLengthUnit = (category: string): LengthUnit => {
    return category === "fencing" ? "ft" : "m";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sort Stock</h1>
        <p className="mt-2 text-muted-foreground">
          Sort and categorize received poles
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Unsorted Stock*</label>
          <Select
            value={formData.unsorted_stock_id}
            onValueChange={(value) =>
              setFormData({ ...formData, unsorted_stock_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unsorted stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {unsortedStocks.map((stock) => (
                  <SelectItem key={stock.id} value={stock.id}>
                    {stock.quantity} poles from{" "}
                    {(stock as any).suppliers?.name || "Unknown"} (
                    {new Date(stock.received_date).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category*</label>
          <Select
            value={formData.category}
            onValueChange={(value: PoleCategory) =>
              setFormData({
                ...formData,
                category: value,
                length_unit: value === "rejected" ? "" : getLengthUnit(value),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {formData.category !== "rejected" && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Size*</label>
              <Select
                value={formData.size}
                onValueChange={(value: PoleSize) =>
                  setFormData({ ...formData, size: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="length">
                Length* ({formData.length_unit})
              </label>
              <Input
                id="length"
                type="number"
                step="0.01"
                required
                value={formData.length_value}
                onChange={(e) =>
                  setFormData({ ...formData, length_value: e.target.value })
                }
              />
            </div>

            {formData.category !== "fencing" && (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="diameter">
                  Diameter (mm)*
                </label>
                <Input
                  id="diameter"
                  type="number"
                  required
                  min="150"
                  max="240"
                  value={formData.diameter_mm}
                  onChange={(e) =>
                    setFormData({ ...formData, diameter_mm: e.target.value })
                  }
                />
              </div>
            )}
          </>
        )}

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
          {isSubmitting ? "Sorting..." : "Sort Stock"}
        </Button>
      </form>
    </div>
  );
};

export default SortStock;
