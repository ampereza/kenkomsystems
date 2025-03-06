
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { TreatmentFormValues } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CylinderNumberFieldProps {
  control: Control<TreatmentFormValues>;
  cylinders?: {
    id: string;
    cylinder_number: number;
    capacity_liters: number;
  }[];
}

export const CylinderNumberField = ({ control, cylinders }: CylinderNumberFieldProps) => {
  return (
    <FormField
      control={control}
      name="cylinderNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cylinder Number</FormLabel>
          <FormControl>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cylinder number" />
              </SelectTrigger>
              <SelectContent>
                {cylinders?.map((cylinder) => (
                  <SelectItem key={cylinder.id} value={cylinder.cylinder_number.toString()}>
                    Cylinder #{cylinder.cylinder_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
