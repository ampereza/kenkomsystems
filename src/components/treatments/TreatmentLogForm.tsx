
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
  cylinderId: string;
  clientId: string;
  waterAddedLiters: number;
  kegsAdded: number;
  kegsRemaining: number;
  chemicalStrength: number;
  chemicalUsed: string;
  facingPoles: number;
  telecomPoles: number;
  distributionPoles: number;
  highVoltagePoles: number;
  notes: string;
  sortedStockId: string;
  quantity: number;
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
      waterAddedLiters: 0,
      kegsAdded: 0,
      kegsRemaining: 0,
      chemicalStrength: 6.0,
      facingPoles: '',
      telecomPoles: '',
      distributionPoles: '',
      highVoltagePoles: '',
      quantity: '',
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

  // Fetch treatment cylinders for dropdown
  const { data: cylinders } = useQuery({
    queryKey: ["treatment_cylinders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("treatment_cylinders").select("*");
      if (error) throw error;
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
      const totalPoles = 
        Number(values.facingPoles) + 
        Number(values.telecomPoles) + 
        Number(values.distributionPoles) + 
        Number(values.highVoltagePoles);

      const treatmentData: any = {
        treatment_date: values.treatmentDate,
        cylinder_id: values.cylinderId,
        client_id: values.clientId,
        water_added_liters: values.waterAddedLiters,
        kegs_added: values.kegsAdded,
        kegs_remaining: values.kegsRemaining,
        chemical_strength: values.chemicalStrength,
        chemical_used: values.chemicalUsed,
        facing_poles: values.facingPoles,
        telecom_poles: values.telecomPoles,
        distribution_poles: values.distributionPoles,
        high_voltage_poles: values.highVoltagePoles,
        total_poles: totalPoles,
        notes: values.notes,
        is_client_owned: values.isClientOwnedPoles,
      };

      // Only include sorted_stock_id and quantity if these are NOT client-owned poles
      if (!values.isClientOwnedPoles) {
        treatmentData.sorted_stock_id = values.sortedStockId;
        treatmentData.quantity = values.quantity;
      } else {
        // For client-owned poles, we still need these fields but can use defaults
        treatmentData.sorted_stock_id = '00000000-0000-0000-0000-000000000000'; // Using a placeholder UUID
        treatmentData.quantity = 0;
      }

      const { error } = await supabase.from("treatments").insert(treatmentData);

      if (error) throw error;
      
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
                name="cylinderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cylinder</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cylinder" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cylinders?.map((cylinder) => (
                          <SelectItem key={cylinder.id} value={cylinder.id}>
                            Cylinder #{cylinder.cylinder_number} ({cylinder.capacity_liters}L)
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
                    <Input {...field} />
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
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
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
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
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
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
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
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
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
                        <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
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
                    <Textarea rows={3} {...field} />
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
