
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

// Form schema
const formSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  stock_type: z.string().min(1, "Stock type is required"),
  quantity: z.coerce.number().positive("Quantity must be a positive number"),
  description: z.string().optional(),
});

export default function AddClientsStock() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch clients for dropdown
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stock_type: "",
      quantity: 0,
      description: "",
    },
  });

  // Use client_poles_stock table instead of client_stock
  const addStockMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      
      // First check if client already has a stock record
      const { data: existingStock, error: fetchError } = await supabase
        .from("client_poles_stock")
        .select("id")
        .eq("client_id", values.client_id)
        .single();
      
      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }
      
      let result;
      
      if (existingStock) {
        // Update existing record with direct values, not using RPC
        const updateData: Record<string, any> = {
          notes: values.description
        };
        
        // Set quantity based on pole type
        if (values.stock_type === "telecom") {
          updateData.untreated_telecom_poles = existingStock.untreated_telecom_poles + values.quantity;
        } else if (values.stock_type === "9m") {
          updateData.untreated_9m_poles = existingStock.untreated_9m_poles + values.quantity;
        } else if (values.stock_type === "10m") {
          updateData.untreated_10m_poles = existingStock.untreated_10m_poles + values.quantity;
        } else if (values.stock_type === "11m") {
          updateData.untreated_11m_poles = existingStock.untreated_11m_poles + values.quantity;
        } else if (values.stock_type === "12m") {
          updateData.untreated_12m_poles = existingStock.untreated_12m_poles + values.quantity;
        } else if (values.stock_type === "14m") {
          updateData.untreated_14m_poles = existingStock.untreated_14m_poles + values.quantity;
        } else if (values.stock_type === "16m") {
          updateData.untreated_16m_poles = existingStock.untreated_16m_poles + values.quantity;
        }
        
        const { data, error } = await supabase
          .from("client_poles_stock")
          .update(updateData)
          .eq("id", existingStock.id)
          .select();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const stockData: any = {
          client_id: values.client_id,
          untreated_telecom_poles: 0,
          untreated_9m_poles: 0,
          untreated_10m_poles: 0,
          untreated_11m_poles: 0,
          untreated_12m_poles: 0,
          untreated_14m_poles: 0,
          untreated_16m_poles: 0,
          notes: values.description
        };
        
        // Set quantity for specific pole type
        if (values.stock_type === "telecom") {
          stockData.untreated_telecom_poles = values.quantity;
        } else if (values.stock_type === "9m") {
          stockData.untreated_9m_poles = values.quantity;
        } else if (values.stock_type === "10m") {
          stockData.untreated_10m_poles = values.quantity;
        } else if (values.stock_type === "11m") {
          stockData.untreated_11m_poles = values.quantity;
        } else if (values.stock_type === "12m") {
          stockData.untreated_12m_poles = values.quantity;
        } else if (values.stock_type === "14m") {
          stockData.untreated_14m_poles = values.quantity;
        } else if (values.stock_type === "16m") {
          stockData.untreated_16m_poles = values.quantity;
        }
        
        const { data, error } = await supabase
          .from("client_poles_stock")
          .insert(stockData)
          .select();
        
        if (error) throw error;
        result = data;
      }
      
      setIsSubmitting(false);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-stock"] });
      toast({
        title: "Stock Added",
        description: "Client stock has been successfully updated.",
      });
      form.reset();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add stock: ${error.message}`,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addStockMutation.mutate(values);
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Add Client Stock</h1>
        
        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              
              <FormField
                control={form.control}
                name="stock_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stock type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="telecom">Telecom Poles</SelectItem>
                        <SelectItem value="9m">9m Poles</SelectItem>
                        <SelectItem value="10m">10m Poles</SelectItem>
                        <SelectItem value="11m">11m Poles</SelectItem>
                        <SelectItem value="12m">12m Poles</SelectItem>
                        <SelectItem value="14m">14m Poles</SelectItem>
                        <SelectItem value="16m">16m Poles</SelectItem>
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
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add Stock"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
}
