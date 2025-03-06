
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { TreatmentFormValues } from "../types";

interface CylinderNumberFieldProps {
  control: Control<TreatmentFormValues>;
}

export const CylinderNumberField = ({ control }: CylinderNumberFieldProps) => {
  return (
    <FormField
      control={control}
      name="cylinderNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cylinder Number</FormLabel>
          <FormControl>
            <Input 
              type="text" 
              placeholder="Enter cylinder number" 
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
