import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TreatmentFormValues } from "../types";

export const useTreatmentLogForm = (onSubmitSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TreatmentFormValues>({
    defaultValues: {
      treatmentDate: new Date().toISOString().split('T')[0],
      cylinderNumber: "",
      waterAddedLiters: 0,
      kegsAdded: 0,
      kegsRemaining: 0,
      chemicalStrength: 6.0,
      facingPoles: null,
      telecomPoles: null,
      distributionPoles: null,
      highVoltagePoles: null,
      quantity: null,
      isClientOwnedPoles: false,
    },
  });

  // Watch for changes in the isClientOwnedPoles field
  const isClientOwnedPoles = form.watch("isClientOwnedPoles");

  // Fetch clients for dropdown
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch cylinders for dropdown
  const { data: cylinders } = useQuery({
    queryKey: ["treatment_cylinders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("treatment_cylinders").select("*");
      if (error) {
        console.error("Error fetching cylinders:", error);
        throw error;
      }
      return data;
    },
  });

  // Fetch sorted stock for dropdown
  const { data: sortedStock } = useQuery({
    queryKey: ["sorted_stock"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sorted_stock").select("*");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: TreatmentFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Starting treatment log submission process");
      
      // Check if required values are provided
      if (!values.cylinderNumber) {
        toast.error("Please enter a cylinder number");
        setIsSubmitting(false);
        return;
      }
      
      if (!values.clientId) {
        toast.error("Please select a client");
        setIsSubmitting(false);
        return;
      }

      // For client-owned poles, we don't need a valid sorted_stock_id
      // For non-client-owned poles, we need both sorted_stock_id and quantity
      if (!values.isClientOwnedPoles) {
        if (!values.sortedStockId) {
          toast.error("Please select a stock category");
          setIsSubmitting(false);
          return;
        }
        
        if (values.quantity === null || values.quantity <= 0) {
          toast.error("Please enter a valid quantity");
          setIsSubmitting(false);
          return;
        }
      }
      
      // Convert cylinder number to integer for lookup
      const cylinderNumberInt = parseInt(values.cylinderNumber, 10);
      
      if (isNaN(cylinderNumberInt)) {
        toast.error("Please enter a valid cylinder number");
        setIsSubmitting(false);
        return;
      }
      
      // Find the cylinder id that corresponds to the cylinder number
      const matchingCylinder = cylinders?.find(
        (cyl) => cyl.cylinder_number === cylinderNumberInt
      );
      
      if (!matchingCylinder) {
        toast.error(`Cylinder #${cylinderNumberInt} not found in the system`);
        setIsSubmitting(false);
        return;
      }
      
      console.log("Preparing treatment data for submission");
      
      // Prepare the treatment data object with the correct field names for the database
      const treatmentData: any = {
        treatment_date: values.treatmentDate,
        cylinder_id: matchingCylinder.id, // Use cylinder_id instead of cylinder_number
        client_id: values.clientId,
        water_added_liters: values.waterAddedLiters,
        kegs_added: values.kegsAdded,
        kegs_remaining: values.kegsRemaining,
        chemical_strength: values.chemicalStrength,
        chemical_used: values.chemicalUsed || null,
        facing_poles: values.facingPoles || 0,
        telecom_poles: values.telecomPoles || 0,
        distribution_poles: values.distributionPoles || 0,
        high_voltage_poles: values.highVoltagePoles || 0,
        notes: values.notes || null,
        is_client_owned: values.isClientOwnedPoles,
      };

      // Only include sorted_stock_id and quantity if these are NOT client-owned poles
      if (!values.isClientOwnedPoles) {
        treatmentData.sorted_stock_id = values.sortedStockId;
        treatmentData.quantity = values.quantity || 0;
      } else {
        // For client-owned poles, we still need a valid sorted_stock_id (required by the database)
        // Get the first available sorted_stock item or create a default one if needed
        if (sortedStock && sortedStock.length > 0) {
          treatmentData.sorted_stock_id = sortedStock[0].id;
        } else {
          // If no sorted stock is available, we need to create one
          const { data: newStock, error: stockError } = await supabase
            .from("sorted_stock")
            .select("id")
            .limit(1);
            
          if (stockError || !newStock || newStock.length === 0) {
            toast.error("Could not find a valid stock reference. Please add stock first.");
            setIsSubmitting(false);
            return;
          }
          treatmentData.sorted_stock_id = newStock[0].id;
        }
        treatmentData.quantity = 0;
      }
      
      console.log("Submitting treatment data to database", treatmentData);
      
      const { data, error } = await supabase
        .from("treatments")
        .insert(treatmentData)
        .select();

      if (error) {
        console.error("Error details:", error);
        toast.error(`Failed to create treatment log: ${error.message}`);
        if (error.details) {
          toast.error(`Details: ${error.details}`);
        }
        setIsSubmitting(false);
        return;
      }
      
      // Check if we need to manually update client stock for client-owned poles
      // Note: For non-client-owned poles, the database trigger will handle the update
      if (values.isClientOwnedPoles) {
        try {
          console.log("Updating client stock for client-owned poles");
          
          // First check if the client already has a stock record
          const { data: existingStock, error: stockCheckError } = await supabase
            .from("client_stock")
            .select("id")
            .eq("client_id", values.clientId)
            .maybeSingle();
            
          if (stockCheckError) {
            console.error("Error checking client stock:", stockCheckError);
            toast.error("Treatment log saved, but failed to update client stock properly.");
          }
          
          // If client doesn't have a stock record yet, create one
          if (!existingStock) {
            const { error: createStockError } = await supabase
              .from("client_stock")
              .insert({
                client_id: values.clientId,
                treated_telecom_poles: values.telecomPoles || 0,
                treated_9m_poles: 0,
                treated_10m_poles: 0,
                treated_11m_poles: 0,
                treated_12m_poles: 0,
                treated_14m_poles: 0,
                treated_16m_poles: 0
              });
              
            if (createStockError) {
              console.error("Error creating client stock:", createStockError);
              toast.error("Treatment log saved, but failed to create client stock record.");
            }
          } 
          // If client does have a stock record, update it
          else {
            // For client-owned poles, update treated pole quantities
            // This is more direct than relying on the database trigger
            const { error: updateStockError } = await supabase
              .from("client_stock")
              .update({
                treated_telecom_poles: supabase.rpc('increment', { 
                  row_id: existingStock.id,
                  column_name: 'treated_telecom_poles',
                  increment_amount: values.telecomPoles || 0
                }),
                // Other pole types would be updated similarly if needed
              })
              .eq("client_id", values.clientId);
              
            if (updateStockError) {
              console.error("Error updating client stock:", updateStockError);
              toast.error("Treatment log saved, but failed to update client stock quantities.");
            }
          }
        } catch (stockUpdateError) {
          console.error("Error in client stock update process:", stockUpdateError);
          toast.error("Treatment log saved, but stock update process encountered an error.");
        }
      }
      
      console.log("Treatment created successfully:", data);
      toast.success("Treatment log entry created successfully");
      form.reset();
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Error submitting treatment log:", error);
      toast.error(`Failed to create treatment log entry: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
    clients,
    sortedStock,
    cylinders,
    isClientOwnedPoles
  };
};
