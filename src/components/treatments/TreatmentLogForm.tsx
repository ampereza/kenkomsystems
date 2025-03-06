
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AlertTriangle } from "lucide-react";
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
    isClientOwnedPoles,
    hasPermission
  } = useTreatmentLogForm(onSubmitSuccess);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>New Treatment Log Entry</CardTitle>
      </CardHeader>
      <CardContent>
        {hasPermission === false && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Permission Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  You don't have permission to create treatment logs. This form requires Managing Director, 
                  General Manager, or Production Manager role.
                </p>
              </div>
            </div>
          </div>
        )}

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
              <Button 
                type="submit" 
                disabled={isSubmitting || hasPermission === false}
              >
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
