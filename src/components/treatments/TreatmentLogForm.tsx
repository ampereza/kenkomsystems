
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

export type TreatmentFormValues = {
  treatmentDate: string;
  cylinderNumber: string; // Changed from cylinderId to cylinderNumber
  clientId: string;
  waterAddedLiters: number;
  kegsAdded: number;
  kegsRemaining: number;
  chemicalStrength: number;
  chemicalUsed: string;
  facingPoles: number | null;
  telecomPoles: number | null;
  distributionPoles: number | null;
  highVoltagePoles: number | null;
  notes: string;
  sortedStockId: string;
  quantity: number | null;
  isClientOwnedPoles: boolean;
};

type TreatmentLogFormProps = {
  onSubmitSuccess: () => void;
  onCancel: () => void;
};

export const TreatmentLogForm = ({ onSubmitSuccess, onCancel }: TreatmentLogFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TreatmentFormValues>({
    defaultValues: {
      treatmentDate: new Date().toISOString().split('T')[0],
      cylinderNumber: "", // Initialize with empty string
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

  // Fetch clients for dropdown
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch cylinders for validation if needed (but we won't use this for dropdown selection)
  const { data: cylinders } = useQuery({
    queryKey: ["treatment_cylinders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_cylinders")
        .select("*")
        .order('cylinder_number');
      if (error) throw error;
      console.log("Fetched cylinders:", data);
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
      
      console.log("Submitting treatment data:", values);
      
      // Find the cylinder_id by cylinder_number - convert the string to a number for comparison
      const cylinderNumberInt = parseInt(values.cylinderNumber, 10);
      
      if (isNaN(cylinderNumberInt)) {
        toast.error("Please enter a valid cylinder number");
        setIsSubmitting(false);
        return;
      }
      
      const { data: cylinderData, error: cylinderError } = await supabase
        .from("treatment_cylinders")
        .select("id")
        .eq("cylinder_number", cylinderNumberInt)
        .single();
      
      if (cylinderError) {
        console.error("Error finding cylinder:", cylinderError);
        toast.error(`Cylinder #${values.cylinderNumber} not found`);
        setIsSubmitting(false);
        return;
      }
      
      const cylinderId = cylinderData.id;
      console.log("Found cylinder ID:", cylinderId);
      
      const treatmentData: any = {
        treatment_date: values.treatmentDate,
        cylinder_id: cylinderId,
        client_id: values.clientId,
        water_added_liters: values.waterAddedLiters,
        kegs_added: values.kegsAdded,
        kegs_remaining: values.kegsRemaining,
        chemical_strength: values.chemicalStrength,
        chemical_used: values.chemicalUsed,
        facing_poles: values.facingPoles || 0,
        telecom_poles: values.telecomPoles || 0,
        distribution_poles: values.distributionPoles || 0,
        high_voltage_poles: values.highVoltagePoles || 0,
        notes: values.notes,
        is_client_owned: values.isClientOwnedPoles,
      };

      // Only include sorted_stock_id and quantity if these are NOT client-owned poles
      if (!values.isClientOwnedPoles) {
        treatmentData.sorted_stock_id = values.sortedStockId;
        treatmentData.quantity = values.quantity || 0;
      } else {
        // For client-owned poles, we still need these fields but can use defaults
        treatmentData.sorted_stock_id = null; // Let the database use the default UUID if needed
        treatmentData.quantity = 0;
      }

      console.log("Sending treatment data to API:", treatmentData);
      
      const { data, error } = await supabase
        .from("treatments")
        .insert(treatmentData)
        .select();

      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      console.log("Treatment created successfully:", data);
      toast.success("Treatment log entry created successfully");
      form.reset();
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting treatment log:", error);
      toast.error("Failed to create treatment log entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch for changes in the isClientOwnedPoles field
  const isClientOwnedPoles = form.watch("isClientOwnedPoles");

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>New Treatment Log Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="treatmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cylinderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cylinder Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="Enter cylinder number" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients?.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isClientOwnedPoles"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Client-Owned Poles</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Toggle if these poles are owned by the client and won't affect your stock.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="waterAddedLiters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Added (L)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kegsAdded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kegs Added</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kegsRemaining"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kegs Remaining</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chemicalStrength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chemical Strength (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chemicalUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chemical Used</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter chemical name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="facingPoles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facing Poles</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter quantity" 
                        value={field.value === null ? '' : field.value} 
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telecomPoles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telecom Poles</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter quantity" 
                        value={field.value === null ? '' : field.value} 
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distributionPoles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distribution Poles</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter quantity" 
                        value={field.value === null ? '' : field.value} 
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="highVoltagePoles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>High Voltage Poles</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter quantity" 
                        value={field.value === null ? '' : field.value} 
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isClientOwnedPoles && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sortedStockId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stock" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sortedStock?.map((stock) => (
                            <SelectItem key={stock.id} value={stock.id}>
                              {stock.category} - {stock.size} ({stock.quantity} available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity to Use</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter quantity" 
                          value={field.value === null ? '' : field.value} 
                          onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} placeholder="Add notes (optional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Treatment Log"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
