
import { Button } from "@/components/ui/button";
import { SortStockFormFields } from "./SortStockFormFields";
import { useSortStockForm } from "@/hooks/useSortStockForm";
import { UnsortedStock } from "./types";

interface SortStockFormProps {
  unsortedStocks: UnsortedStock[];
  onSuccess: () => void;
}

export const SortStockForm = ({ unsortedStocks, onSuccess }: SortStockFormProps) => {
  const { 
    formData, 
    setFormData, 
    isSubmitting, 
    handleSubmit, 
    getLengthUnit 
  } = useSortStockForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      <SortStockFormFields
        formData={formData}
        setFormData={setFormData}
        unsortedStocks={unsortedStocks}
        getLengthUnit={getLengthUnit}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sorting..." : "Sort Stock"}
      </Button>
    </form>
  );
};
