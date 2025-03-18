import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TransactionType } from '@/types/FinancialSummary';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const allowedTransactionTypes: TransactionType[] = [
  "purchase", "sale", "expense", "salary", "treatment_income"
];

export const TransactionDialog: React.FC<TransactionDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [type, setType] = useState<TransactionType>("purchase");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [reference_number, setReferenceNumber] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [supplier_id, setSupplierId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Cast the transaction type to ensure it's one of the allowed types
      const safeType = type as TransactionType;
      
      // Only proceed if it's a valid type
      if (!allowedTransactionTypes.includes(safeType)) {
        toast({
          variant: "destructive",
          title: "Invalid transaction type",
          description: "The selected transaction type is not valid.",
        });
        return;
      }
      
      const { error } = await supabase
        .from('transactions')
        .insert({
          type: safeType,
          amount,
          description,
          reference_number,
          transaction_date: date ? format(date, 'yyyy-MM-dd') : '',
          supplier_id,
          notes
        });

      if (error) throw error;

      toast({
        title: "Transaction added",
        description: "The transaction has been added successfully.",
      });

      // Reset form
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields go here */}
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as TransactionType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  {allowedTransactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                type="text"
                placeholder="Enter reference number"
                value={reference_number}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Transaction Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2020-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier_id">Supplier ID</Label>
              <Input
                id="supplier_id"
                type="text"
                placeholder="Enter supplier ID"
                value={supplier_id}
                onChange={(e) => setSupplierId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
