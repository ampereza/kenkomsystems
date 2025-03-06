
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

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    getLengthUnit
  };
}
