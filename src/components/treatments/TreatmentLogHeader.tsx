
import { Button } from "@/components/ui/button";

type TreatmentLogHeaderProps = {
  onAddNewClick: () => void;
  showForm: boolean;
};

export const TreatmentLogHeader = ({ onAddNewClick, showForm }: TreatmentLogHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Treatment Operations</h1>
        <p className="text-muted-foreground">
          View and manage all treatment operations and records
        </p>
      </div>
      <Button onClick={onAddNewClick}>
        {showForm ? "Cancel" : "Add New Treatment"}
      </Button>
    </div>
  );
};
