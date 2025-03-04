
import { useState } from "react";
import { TreatmentLogTable } from "@/components/treatments/TreatmentLogTable";
import { TreatmentLogForm } from "@/components/treatments/TreatmentLogForm";
import { TreatmentLogHeader } from "@/components/treatments/TreatmentLogHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function TreatmentLog() {
  const [showForm, setShowForm] = useState(false);

  const handleAddNewClick = () => {
    setShowForm(!showForm);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mx-auto py-6">
      <TreatmentLogHeader 
        onAddNewClick={handleAddNewClick}
        showForm={showForm}
      />

      {showForm && (
        <TreatmentLogForm 
          onSubmitSuccess={handleFormSuccess} 
          onCancel={handleFormCancel}
        />
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <TreatmentLogTable />
        </CardContent>
      </Card>
    </div>
  );
}
