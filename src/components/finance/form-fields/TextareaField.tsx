
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface TextareaFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export function TextareaField({ control, name, label, placeholder, required = false }: TextareaFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && '*'}</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder={placeholder || `Enter ${label.toLowerCase()}`} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
