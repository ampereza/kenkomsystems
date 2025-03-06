
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PoleCategory, PoleSize, LengthUnit, FormData } from "@/components/stock/types";

export function useSortStockForm(onSuccess: () => void) {
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
    if (!formData.category || !formData.quantity || !formData.unsorted_stock_id || !formData.size) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for insert
      const sorting_date = new Date().toISOString();
      const insertData = {
        unsorted_stock_id: formData.unsorted_stock_id,
        category: formData.category,
        size: formData.size,
        quantity: parseInt(formData.quantity),
        length_value: formData.length_value ? parseFloat(formData.length_value) : null,
        length_unit: formData.length_unit,
        diameter_mm: formData.category !== "fencing" && formData.diameter_mm ? parseInt(formData.diameter_mm) : null,
        notes: formData.notes || null,
        sorting_date: sorting_date,
      };

      // Insert into sorted_stock table
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

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    getLengthUnit
  };
}
