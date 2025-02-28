
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  TreatmentTable,
  TreatmentTableHeader,
  TreatmentTableHead,
  TreatmentTableCell,
  TableBody,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, FileDown } from "lucide-react";

interface TreatmentLogEntry {
  id: string;
  treatment_date: string;
  cylinder_number: number;
  water_added_liters: number;
  kegs_added: number;
  kegs_remaining: number;
  chemical_strength: number;
  facing_poles: number;
  telecom_poles: number;
  distribution_poles: number;
  high_voltage_poles: number;
  total_poles: number;
  client_name: string;
  notes: string;
}

export function TreatmentLogTable() {
  const { data: treatmentLog, isLoading } = useQuery({
    queryKey: ["treatment-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_summary")
        .select("*")
        .order("treatment_date", { ascending: false });

      if (error) throw error;
      return data as TreatmentLogEntry[];
    },
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export functionality would go here
    alert("Export functionality to be implemented");
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading treatment log...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Treatment Log</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <TreatmentTable className="border rounded-md">
        <TableCaption>
          Complete treatment log of all cylinders and processed poles.
        </TableCaption>
        <TreatmentTableHeader>
          <TableRow>
            <TreatmentTableHead>Date</TreatmentTableHead>
            <TreatmentTableHead>Cylinder No.</TreatmentTableHead>
            <TreatmentTableHead>Liters Added</TreatmentTableHead>
            <TreatmentTableHead>Kegs Added</TreatmentTableHead>
            <TreatmentTableHead>Kegs Remaining</TreatmentTableHead>
            <TreatmentTableHead>% Strength</TreatmentTableHead>
            <TreatmentTableHead>Fencing Poles</TreatmentTableHead>
            <TreatmentTableHead>Telecom</TreatmentTableHead>
            <TreatmentTableHead>Distribution</TreatmentTableHead>
            <TreatmentTableHead>High Voltage</TreatmentTableHead>
            <TreatmentTableHead>Total Poles</TreatmentTableHead>
            <TreatmentTableHead>Treatment For</TreatmentTableHead>
          </TableRow>
        </TreatmentTableHeader>
        <TableBody>
          {treatmentLog?.map((entry) => (
            <TableRow key={entry.id}>
              <TreatmentTableCell>
                {entry.treatment_date ? format(new Date(entry.treatment_date), "dd/MM/yyyy") : "-"}
              </TreatmentTableCell>
              <TreatmentTableCell>{entry.cylinder_number || "-"}</TreatmentTableCell>
              <TreatmentTableCell>{entry.water_added_liters || "-"}</TreatmentTableCell>
              <TreatmentTableCell>{entry.kegs_added || "-"}</TreatmentTableCell>
              <TreatmentTableCell>{entry.kegs_remaining || "-"}</TreatmentTableCell>
              <TreatmentTableCell>
                {entry.chemical_strength ? `${entry.chemical_strength}%` : "-"}
              </TreatmentTableCell>
              <TreatmentTableCell>{entry.facing_poles || "-"}</TreatmentTableCell>
              <TreatmentTableCell>{entry.telecom_poles || "-"}</TreatmentTableCell>
              <TreatmentTableCell>{entry.distribution_poles || "-"}</TreatmentTableCell>
              <TreatmentTableCell>{entry.high_voltage_poles || "-"}</TreatmentTableCell>
              <TreatmentTableCell>{entry.total_poles || "-"}</TreatmentTableCell>
              <TreatmentTableCell>{entry.client_name || "Internal"}</TreatmentTableCell>
            </TableRow>
          ))}
          {(!treatmentLog || treatmentLog.length === 0) && (
            <TableRow>
              <TreatmentTableCell colSpan={12} className="text-center h-24">
                No treatment records found
              </TreatmentTableCell>
            </TableRow>
          )}
        </TableBody>
      </TreatmentTable>
    </div>
  );
}
