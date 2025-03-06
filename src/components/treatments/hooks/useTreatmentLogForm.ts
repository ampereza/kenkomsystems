
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TreatmentFormValues } from "../types";
import { useAuth } from "@/components/auth/AuthProvider";

export const useTreatmentLogForm = (onSubmitSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { profile } = useAuth();
  
  // Check if the user has permission to create treatment logs
  useEffect(() => {
    if (profile) {
      const allowedRoles = ['managing_director', 'general_manager', 'production_manager'];
      setHasPermission(allowedRoles.includes(profile.role));
    }
  }, [profile]);
  
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
    // First check if user has permission
    if (hasPermission === false) {
      toast.error("You don't have permission to create treatment logs. Required roles: Managing Director, General Manager, or Production Manager.");
      return;
    }
    
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
        
        if (error.code === "42501") {
          toast.error("Permission denied. You don't have the required role to create treatment logs.");
          // Redirect to unauthorized page
          window.location.href = "/unauthorized";
          setIsSubmitting(false);
          return;
        }
        
        toast.error(`Failed to create treatment log: ${error.message}`);
        if (error.details) {
          toast.error(`Details: ${error.details}`);
        }
        setIsSubmitting(false);
        return;
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
    isClientOwnedPoles,
    hasPermission
  };
};
