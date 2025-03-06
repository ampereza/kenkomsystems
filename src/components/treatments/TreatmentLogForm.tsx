
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTreatmentLogForm } from "./hooks/useTreatmentLogForm";
import { TreatmentLogFormProps } from "./types";
import { TreatmentDateField } from "./form-fields/TreatmentDateField";
import { CylinderNumberField } from "./form-fields/CylinderNumberField";
import { SelectClientField } from "./form-fields/SelectClientField";
import { ClientOwnershipField } from "./form-fields/ClientOwnershipField";
import { ChemicalInfoFields } from "./form-fields/ChemicalInfoFields";
import { PoleQuantityFields } from "./form-fields/PoleQuantityFields";
import { StockInfoFields } from "./form-fields/StockInfoFields";
import { NotesField } from "./form-fields/NotesField";

export const TreatmentLogForm = ({ onSubmitSuccess, onCancel }: TreatmentLogFormProps) => {
  const {
    form,
    isSubmitting,
    onSubmit,
    clients,
    sortedStock,
    cylinders,
    isClientOwnedPoles
  } = useTreatmentLogForm(onSubmitSuccess);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>New Treatment Log Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TreatmentDateField control={form.control} />
              <CylinderNumberField control={form.control} cylinders={cylinders} />
              <SelectClientField control={form.control} clients={clients} />
            </div>

            <ClientOwnershipField control={form.control} />
            <ChemicalInfoFields control={form.control} />
            <PoleQuantityFields control={form.control} />

            {!isClientOwnedPoles && (
              <StockInfoFields control={form.control} sortedStock={sortedStock} />
            )}

            <NotesField control={form.control} />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Treatment Log"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
