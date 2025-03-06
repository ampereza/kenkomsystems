
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

export interface UnsortedStock {
  id: string;
  quantity: number;
  supplier_id: string | null;
  received_date: string;
  notes: string | null;
  created_at: string | null;
  suppliers?: { name: string };
}

export interface FormData {
  unsorted_stock_id: string;
  category: PoleCategory | "";
  size: PoleSize | null;
  length_value: string;
  length_unit: LengthUnit | null;
  diameter_mm: string;
  quantity: string;
  notes: string;
}

interface SortStockFormProps {
  unsortedStocks: UnsortedStock[];
  onSuccess: () => void;
}

export const SortStockForm = ({ unsortedStocks, onSuccess }: SortStockFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    unsorted_stock_id: "",
    category: "",
    size: null,
    length_value: "",
    length_unit: null,
    diameter_mm: "",
    quantity: "",
    notes: "",
  });

  const getLengthUnit = (category: string): LengthUnit => {
    return category === "fencing" ? "ft" : "m";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation - check required fields
    if (!formData.category || !formData.quantity || !formData.unsorted_stock_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Special validation for non-rejected categories
    if (formData.category !== "rejected") {
      if (!formData.size) {
        toast({
          title: "Error",
          description: "Please select a size",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Prepare data for insert based on category
      const baseData = {
        unsorted_stock_id: formData.unsorted_stock_id,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        notes: formData.notes || null,
        sorting_date: new Date().toISOString(), // Add sorting_date explicitly for the trigger
      };

      // Add additional fields for non-rejected categories
      const insertData = formData.category === "rejected" 
        ? baseData 
        : {
            ...baseData,
            size: formData.size,
            length_value: formData.length_value ? parseFloat(formData.length_value) : null,
            length_unit: formData.length_unit,
            diameter_mm: formData.category !== "fencing" && formData.diameter_mm ? parseInt(formData.diameter_mm) : null,
          };

      // Insert into sorted_stock table - the database trigger "track_rejected_poles" will handle
      // the insertion into rejected_poles_with_suppliers automatically
      const { error: insertError } = await supabase.from("sorted_stock").insert(insertData);
      
      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Stock sorted successfully",
      });

      // Reset form
      setFormData({
        unsorted_stock_id: "",
        category: "",
        size: null,
        length_value: "",
        length_unit: null,
        diameter_mm: "",
        quantity: "",
        notes: "",
      });

      // Call the onSuccess callback to refresh data
      onSuccess();
    } catch (error) {
      console.error("Error sorting stock:", error);
      toast({
        title: "Error",
        description: "Failed to sort stock: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                  {stock.suppliers?.name || "Unknown"} (
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
              length_unit: value === "rejected" ? null : getLengthUnit(value),
              size: value === "rejected" ? null : formData.size,
              length_value: value === "rejected" ? "" : formData.length_value,
              diameter_mm: value === "rejected" ? "" : formData.diameter_mm,
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
              value={formData.size || ""}
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
  );
};

