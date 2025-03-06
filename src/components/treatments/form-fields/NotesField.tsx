
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { TreatmentFormValues } from "../types";

interface NotesFieldProps {
  control: Control<TreatmentFormValues>;
}

export const NotesField = ({ control }: NotesFieldProps) => {
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} placeholder="Add notes (optional)" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
