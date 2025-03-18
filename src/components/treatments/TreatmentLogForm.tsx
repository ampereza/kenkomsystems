
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
  chemical_type: z.string().min(1, "Chemical type is required"),
  concentration: z.coerce.number().min(0, "Concentration must be positive").max(100, "Concentration must not exceed 100"),
  operator_name: z.string().min(1, "Operator name is required"),
  poles_treated: z.coerce.number().min(1, "Number of poles must be at least 1"),
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
      chemical_type: "",
      concentration: 0,
      operator_name: "",
      poles_treated: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("treatment_log").insert([
        {
          date: data.date,
          chemical_type: data.chemical_type,
          concentration: data.concentration,
          operator_name: data.operator_name,
          poles_treated: data.poles_treated,
          notes: data.notes,
        },
      ]);

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
                name="chemical_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chemical Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chemical type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CCA">CCA</SelectItem>
                        <SelectItem value="Creosote">Creosote</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="concentration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concentration (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" max="100" step="0.1" />
                    </FormControl>
                    <FormDescription>Enter a value between 0 and 100</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operator_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operator Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="poles_treated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Poles Treated</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min="1" />
                  </FormControl>
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
