
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube2, Calendar, TrendingUp, Users } from "lucide-react";

const TreatmentDashboard = () => {
  // Fetch treatment logs instead of treatment_summary
  const { data: treatments, isLoading: treatmentsLoading } = useQuery({
    queryKey: ["treatment-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_log")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get clients for reference
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate summary stats
  const totalTreatments = treatments?.length || 0;
  const totalPoles = treatments?.reduce((acc, curr) => acc + (curr.total_poles || 0), 0) || 0;
  
  // Calculate average chemical strength
  const avgStrength = treatments && treatments.length > 0
    ? treatments.reduce((acc, curr) => acc + (curr.strength_percentage || 0), 0) / treatments.length
    : 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Treatment Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TestTube2 className="mr-2 h-4 w-4 text-blue-500" /> Total Treatments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalTreatments}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-green-500" /> Total Treated Poles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalPoles}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-orange-500" /> Avg. Chemical Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{avgStrength.toFixed(2)}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4 text-purple-500" /> Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{clients?.length || 0}</p>
            </CardContent>
          </Card>
        </div>
        
        {treatmentsLoading ? (
          <div className="text-center py-8">Loading treatment data...</div>
        ) : treatments && treatments.length > 0 ? (
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Poles</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strength %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {treatments.map((treatment) => {
                  const clientName = clients?.find(c => c.id === treatment.client_id)?.name || 'N/A';
                  
                  return (
                    <tr key={treatment.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(treatment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{clientName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{treatment.total_poles || 0}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{treatment.strength_percentage || 0}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">No treatment records found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Create a wrapper component that exports the dashboard
const TreatmentDashboardWrapper = () => {
  return <TreatmentDashboard />;
};

export default TreatmentDashboardWrapper;
