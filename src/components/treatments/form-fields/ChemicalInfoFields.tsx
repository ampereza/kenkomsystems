
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

interface ChemicalInfoFieldsProps {
  control: Control<TreatmentFormValues>;
}

export const ChemicalInfoFields = ({ control }: ChemicalInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FormField
        control={control}
        name="waterAddedLiters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Water Added (L)</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="kegsAdded"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kegs Added</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="kegsRemaining"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kegs Remaining</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="chemicalStrength"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chemical Strength (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="chemicalUsed"
        render={({ field }) => (
          <FormItem className="md:col-span-4">
            <FormLabel>Chemical Used</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter chemical name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
