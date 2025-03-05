
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Printer } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Form schemas for different document types
const deliveryNoteSchema = z.object({
  note_number: z.string().min(1, { message: "Note number is required" }),
  date: z.date(),
  client_name: z.string().min(1, { message: "Client name is required" }),
  batch_number: z.string().optional(),
  vehicle_number: z.string().optional(),
  transporter: z.string().optional(),
  loaded_by: z.string().optional(),
  notes: z.string().optional(),
  total_quantity: z.coerce.number().min(0),
});

const paymentVoucherSchema = z.object({
  voucher_number: z.string().min(1, { message: "Voucher number is required" }),
  date: z.date(),
  paid_to: z.string().min(1, { message: "Paid to is required" }),
  amount_in_words: z.string().optional(),
  payment_approved_by: z.string().optional(),
  received_by: z.string().optional(),
  total_amount: z.coerce.number().min(0),
});

const expenseAuthSchema = z.object({
  authorization_number: z.string().min(1, { message: "Authorization number is required" }),
  date: z.date(),
  received_from: z.string().optional(),
  being_payment_of: z.string().optional(),
  cash_cheque_no: z.string().optional(),
  sum_of_shillings: z.coerce.number().min(0),
});

const receiptSchema = z.object({
  receipt_number: z.string().min(1, { message: "Receipt number is required" }),
  date: z.date(),
  received_from: z.string().optional(),
  payment_method: z.string().optional(),
  for_payment: z.string().optional(),
  amount: z.coerce.number().min(0),
});

type DocumentType = "delivery-notes" | "payment-vouchers" | "expense-authorizations" | "receipts";

interface DocumentFormProps {
  documentType: DocumentType;
  onSuccess: () => void;
}

export function DocumentForm({ documentType, onSuccess }: DocumentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the correct schema based on document type
  let schema;
  let tableName;
  
  switch (documentType) {
    case "delivery-notes":
      schema = deliveryNoteSchema;
      tableName = "delivery_notes";
      break;
    case "payment-vouchers":
      schema = paymentVoucherSchema;
      tableName = "payment_vouchers";
      break;
    case "expense-authorizations":
      schema = expenseAuthSchema;
      tableName = "expense_authorizations";
      break;
    case "receipts":
      schema = receiptSchema;
      tableName = "receipts";
      break;
    default:
      schema = z.object({});
      tableName = "";
  }

  // Create the form with the appropriate schema
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!tableName) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from(tableName).insert([data]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Document created successfully",
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create document. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form fields for Delivery Notes */}
          {documentType === "delivery-notes" && (
            <>
              <FormField
                control={form.control}
                name="note_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note Number*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter note number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter client name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="batch_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter batch number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vehicle_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter vehicle number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transporter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transporter</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter transporter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="loaded_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loaded By</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter loader name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="total_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        placeholder="Enter total quantity" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Form fields for Payment Vouchers */}
          {documentType === "payment-vouchers" && (
            <>
              <FormField
                control={form.control}
                name="voucher_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voucher Number*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter voucher number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paid_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid To*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter recipient name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field} 
                        placeholder="Enter amount" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount_in_words"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount in Words</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter amount in words" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payment_approved_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approved By</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter approver name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="received_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received By</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter receiver name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Form fields for Expense Authorizations */}
          {documentType === "expense-authorizations" && (
            <>
              <FormField
                control={form.control}
                name="authorization_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorization Number*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter authorization number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                      <Input {...field} placeholder="Enter source name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sum_of_shillings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field} 
                        placeholder="Enter amount" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="being_payment_of"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Being Payment Of</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter payment description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cash_cheque_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cash/Cheque No.</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter cash or cheque number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Form fields for Receipts */}
          {documentType === "receipts" && (
            <>
              <FormField
                control={form.control}
                name="receipt_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt Number*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter receipt number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                      <Input {...field} placeholder="Enter source name" />
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
                    <FormLabel>Amount*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field} 
                        placeholder="Enter amount" 
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
                      <Input {...field} placeholder="Enter payment method" />
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
                    <FormLabel>For Payment</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter payment description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {/* Common Notes field for all document types */}
        {documentType === "delivery-notes" && (
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter additional notes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Document"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
