
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TestTube2, Users, Activity } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TreatmentLogTable } from "@/components/treatments/TreatmentLogTable";

export default function TreatmentDashboard() {
  const { data: treatmentSummary } = useQuery({
    queryKey: ["treatment-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_summary")
        .select("*")
        .order("treatment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Treatment Management Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Treatments</CardTitle>
              <TestTube2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {treatmentSummary?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(treatmentSummary?.map(t => t.client_name)).size || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Chemical Strength</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {treatmentSummary && treatmentSummary.length > 0
                  ? `${(treatmentSummary.reduce((acc, curr) => acc + (curr.chemical_strength || 0), 0) / treatmentSummary.length).toFixed(1)}%`
                  : "0%"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <TreatmentLogTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
