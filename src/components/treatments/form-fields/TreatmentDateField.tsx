
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

interface TreatmentDateFieldProps {
  control: Control<TreatmentFormValues>;
}

export const TreatmentDateField = ({ control }: TreatmentDateFieldProps) => {
  return (
    <FormField
      control={control}
      name="treatmentDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Treatment Date</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
