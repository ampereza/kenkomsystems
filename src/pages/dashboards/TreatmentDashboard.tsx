
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flask, Users, Cylinder, Activity } from "lucide-react";

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Treatment Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Flask className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cylinders Active</CardTitle>
            <Cylinder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chemical Strength</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.0%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Treatment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {treatmentSummary?.map((treatment) => (
                <div key={treatment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{treatment.client_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Cylinder {treatment.cylinder_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{treatment.total_poles} poles</p>
                    <p className="text-sm text-muted-foreground">
                      {treatment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chemical Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {/* Add chemical usage chart here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
