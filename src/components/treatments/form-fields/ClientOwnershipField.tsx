
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { TreatmentFormValues } from "../types";

interface ClientOwnershipFieldProps {
  control: Control<TreatmentFormValues>;
}

export const ClientOwnershipField = ({ control }: ClientOwnershipFieldProps) => {
  return (
    <FormField
      control={control}
      name="isClientOwnedPoles"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Client-Owned Poles</FormLabel>
            <p className="text-sm text-muted-foreground">
              Toggle if these poles are owned by the client and won't affect your stock.
            </p>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
