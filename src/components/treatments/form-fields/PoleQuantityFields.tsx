
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

interface PoleQuantityFieldsProps {
  control: Control<TreatmentFormValues>;
}

export const PoleQuantityFields = ({ control }: PoleQuantityFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FormField
        control={control}
        name="facingPoles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facing Poles</FormLabel>
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

      <FormField
        control={control}
        name="telecomPoles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telecom Poles</FormLabel>
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

      <FormField
        control={control}
        name="distributionPoles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Distribution Poles</FormLabel>
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

      <FormField
        control={control}
        name="highVoltagePoles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>High Voltage Poles</FormLabel>
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
