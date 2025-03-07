
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const receiptFormSchema = z.object({
  receipt_number: z.string().min(1, { message: "Receipt number is required" }),
  received_from: z.string().min(1, { message: "Received from is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  for_payment: z.string().optional(),
  payment_method: z.string().optional(),
  signature: z.string().optional(),
});

type ReceiptFormValues = z.infer<typeof receiptFormSchema>;

export function ReceiptDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      receipt_number: "",
      received_from: "",
      amount: 0,
      for_payment: "",
      payment_method: "Cash",
      signature: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ReceiptFormValues) => {
      // Insert into receipts table
      const { data: receiptData, error: receiptError } = await supabase
        .from("receipts")
        .insert({
          receipt_number: values.receipt_number,
          received_from: values.received_from,
          amount: values.amount,
          for_payment: values.for_payment,
          payment_method: values.payment_method,
          signature: values.signature,
        })
        .select();

      if (receiptError) throw receiptError;

      // Also create a transaction record to track this as income
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          type: "sale", // Using 'sale' as the income type
          amount: values.amount,
          description: `Receipt: ${values.receipt_number} from ${values.received_from}`,
          reference_number: values.receipt_number,
          notes: values.for_payment || "Receipt payment",
        });

      if (transactionError) throw transactionError;

      return receiptData;
    },
    onSuccess: () => {
      // Invalidate all related queries to ensure data is refreshed everywhere
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      queryClient.invalidateQueries({ queryKey: ["income-statement"] });
      queryClient.invalidateQueries({ queryKey: ["income-statement-detailed"] });
      queryClient.invalidateQueries({ queryKey: ["income-statement-by-account"] });
      queryClient.invalidateQueries({ queryKey: ["income-statement-summary"] });
      queryClient.invalidateQueries({ queryKey: ["balance-sheet"] });
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["financial-stats"] });
      queryClient.invalidateQueries({ queryKey: ["md-financial-summary"] });
      
      toast({
        title: "Success",
        description: "Receipt has been created",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create receipt: " + error.message,
      });
    },
  });

  function onSubmit(values: ReceiptFormValues) {
    mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Receipt</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="receipt_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter receipt number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="received_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Received From</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter payer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="for_payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>For Payment Of</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter payment description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cash, cheque, bank transfer, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <Input placeholder="Received by" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Receipt
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
