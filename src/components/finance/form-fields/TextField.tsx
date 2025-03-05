
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface TextFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export function TextField({ control, name, label, placeholder, required = false }: TextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && '*'}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder || `Enter ${label.toLowerCase()}`} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
