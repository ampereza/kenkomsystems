
import {
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
import { Control } from "react-hook-form";
import { TreatmentFormValues } from "../types";

interface StockInfoFieldsProps {
  control: Control<TreatmentFormValues>;
  sortedStock: any[] | null;
}

export const StockInfoFields = ({ control, sortedStock }: StockInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
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
  );
};
