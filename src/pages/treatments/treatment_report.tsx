
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TreatmentNavbar } from "@/components/navigation/TreatmentNavbar";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreatmentLogTable } from "@/components/treatments/TreatmentLogTable";

export default function TreatmentReport() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const { data: treatmentStats, isLoading } = useQuery({
    queryKey: ["treatment-stats", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_summary")
        .select("*")
        .gte("treatment_date", dateRange.from.toISOString())
        .lte("treatment_date", dateRange.to.toISOString());

      if (error) throw error;
      return data;
    },
  });

  const getTotalPoles = () => {
    if (!treatmentStats) return 0;
    return treatmentStats.reduce((sum, item) => sum + (item.total_poles || 0), 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TreatmentNavbar />
      <main className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Treatment Report</h1>
        
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Treatments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : treatmentStats?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Poles Treated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : getTotalPoles()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Poles per Treatment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading || !treatmentStats?.length
                  ? "Loading..."
                  : Math.round(getTotalPoles() / treatmentStats.length)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <TreatmentLogTable />
      </main>
    </div>
  );
}
