
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export function TreatmentLogTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: treatments, isLoading } = useQuery({
    queryKey: ["treatment-log", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_log")
        .select("*")
        .order("date", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading treatment records...</div>;
  }

  if (!treatments || treatments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No treatment records found
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Cylinder</TableHead>
            <TableHead>Strength %</TableHead>
            <TableHead>Poles Treated</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {treatments.map((treatment) => (
            <TableRow key={treatment.id}>
              <TableCell>
                {new Date(treatment.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{treatment.cylinder_number}</TableCell>
              <TableCell>{treatment.strength_percentage}%</TableCell>
              <TableCell>{treatment.total_poles}</TableCell>
              <TableCell>{treatment.treatment_purpose}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={!treatments || treatments.length < pageSize}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
