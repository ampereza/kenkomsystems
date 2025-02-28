
import { Navbar } from "@/components/Navbar";
import { TreatmentLogTable } from "@/components/treatments/TreatmentLogTable";
import { Card, CardContent } from "@/components/ui/card";

export default function TreatmentLog() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Treatment Operations</h1>
          <p className="text-muted-foreground">
            View and manage all treatment operations and records
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <TreatmentLogTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
