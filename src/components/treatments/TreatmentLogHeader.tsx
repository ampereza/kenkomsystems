
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface TreatmentLogHeaderProps {
  onAddNewClick: () => void;
  showForm: boolean;
}

export function TreatmentLogHeader({ onAddNewClick, showForm }: TreatmentLogHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Treatment Log</h1>
      <Button onClick={onAddNewClick}>
        {showForm ? (
          <>
            <X className="mr-2 h-4 w-4" /> Cancel
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" /> Add New Treatment
          </>
        )}
      </Button>
    </div>
  );
}
