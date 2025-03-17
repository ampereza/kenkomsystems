
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define a narrower set of transaction types that matches the database
const TransactionType = z.enum([
  "purchase",
  "sale",
  "expense",
  "salary",
  "treatment_income",
]);

const transactionFormSchema = z.object({
  type: TransactionType,
  amount: z.coerce.number().positive(),
  description: z.string().optional(),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
  supplier_id: z.string().optional(),
  sorted_stock_id: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function TransactionDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suppliers for the select input
  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Fetch sorted stock for the select input
  const { data: sortedStock } = useQuery({
    queryKey: ["sorted-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sorted_stock")
        .select("id, category, size")
        .gt("quantity", 0)
        .order("category");

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "purchase",
      amount: 0,
      description: "",
      reference_number: "",
      notes: "",
      supplier_id: undefined,
      sorted_stock_id: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      // Ensure we're only using transaction types allowed by the database
      const { data, error } = await supabase.from("transactions").insert({
        type: values.type,
        amount: values.amount,
        description: values.description,
        reference_number: values.reference_number,
        notes: values.notes,
        supplier_id: values.supplier_id || null,
        sorted_stock_id: values.sorted_stock_id || null,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Success",
        description: "Transaction has been created",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create transaction: " + error.message,
      });
    },
  });

  const selectedType = form.watch("type");

  function onSubmit(values: TransactionFormValues) {
    mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="treatment_income">
                        Treatment Income
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedType === "purchase" && (
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers?.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {selectedType === "sale" && (
              <FormField
                control={form.control}
                name="sorted_stock_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Item</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stock item" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sortedStock?.map((stock) => (
                          <SelectItem key={stock.id} value={stock.id}>
                            {stock.category} - {stock.size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      {...field}
                    />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reference_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reference number" {...field} />
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
                    <Textarea placeholder="Enter notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Transaction
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
