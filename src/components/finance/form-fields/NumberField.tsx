
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface NumberFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  min?: string;
  step?: string;
  required?: boolean;
}

export function NumberField({ 
  control, 
  name, 
  label, 
  placeholder, 
  min = "0", 
  step = "0.01", 
  required = false 
}: NumberFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && '*'}</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min={min}
              step={step}
              {...field} 
              placeholder={placeholder || `Enter ${label.toLowerCase()}`} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
