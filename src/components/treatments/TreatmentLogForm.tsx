
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  cylinder_number: z.string().min(1, "Cylinder number is required"),
  liters_added: z.string().min(1, "Liters added is required"),
  kegs_added: z.coerce.number().min(0, "Kegs added must be positive"),
  kegs_remaining: z.coerce.number().min(0, "Kegs remaining must be positive"),
  strength_percentage: z.coerce.number().min(0, "Strength percentage must be positive").max(100, "Strength percentage must not exceed 100"),
  total_poles: z.coerce.number().min(1, "Number of poles must be at least 1"),
  treatment_purpose: z.string().min(1, "Treatment purpose is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TreatmentLogFormProps {
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function TreatmentLogForm({ onSubmitSuccess, onCancel }: TreatmentLogFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      cylinder_number: "",
      liters_added: "",
      kegs_added: 0,
      kegs_remaining: 0,
      strength_percentage: 0,
      total_poles: 0,
      treatment_purpose: "KDL",
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("treatment_log").insert({
        date: data.date,
        cylinder_number: data.cylinder_number,
        liters_added: data.liters_added,
        kegs_added: data.kegs_added,
        kegs_remaining: data.kegs_remaining,
        strength_percentage: data.strength_percentage,
        total_poles: data.total_poles,
        treatment_purpose: data.treatment_purpose,
        notes: data.notes,
      });

      if (error) throw error;

      toast({
        title: "Treatment log added",
        description: "Your treatment record has been saved successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["treatment-log"] });
      onSubmitSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding treatment log",
        description: error.message || "There was a problem saving your treatment log.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Record New Treatment</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cylinder_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cylinder Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="liters_added"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liters Added</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="strength_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strength Percentage (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" max="100" step="0.1" />
                    </FormControl>
                    <FormDescription>Enter a value between 0 and 100</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="kegs_added"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kegs Added</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kegs_remaining"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kegs Remaining</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="total_poles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Poles Treated</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment_purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Purpose</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="KDL">KDL</SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Treatment Record"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
