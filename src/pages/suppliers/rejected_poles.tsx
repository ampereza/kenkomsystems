
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StockNavbar } from "@/components/navigation/StockNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function RejectedPoles() {
  const { data: rejectedPoles, isLoading } = useQuery({
    queryKey: ["rejected-poles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rejected_stock")
        .select("*, suppliers(name)")
        .order("rejection_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <StockNavbar />
      <main className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Rejected Poles</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading rejected poles data...</p>
          </div>
        ) : rejectedPoles?.length === 0 ? (
          <Card className="w-full p-6 text-center">
            <CardContent>
              <p className="text-muted-foreground">No rejected poles found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Rejected Poles Register</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Action Taken</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedPoles?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {format(new Date(item.rejection_date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{item.suppliers?.name || "Unknown"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.pole_type || "Standard"}</TableCell>
                      <TableCell>{item.rejection_reason}</TableCell>
                      <TableCell>{item.action_taken || "Returned to supplier"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
