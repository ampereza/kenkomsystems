
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PrintDocument } from "@/components/finance/PrintDocument";

type DeliveryNote = {
  id: string;
  note_number: string;
  date: string;
  client_name: string;
  total_quantity: number;
};

interface DeliveryNotesTableProps {
  onViewDocument: (document: DeliveryNote) => void;
}

export function DeliveryNotesTable({ onViewDocument }: DeliveryNotesTableProps) {
  const { data: deliveryNotes, isLoading } = useQuery({
    queryKey: ["delivery-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DeliveryNote[];
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Note #</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Client</th>
            <th className="border px-4 py-2 text-left">Quantity</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="border px-4 py-2 text-center">
                Loading...
              </td>
            </tr>
          ) : deliveryNotes && deliveryNotes.length > 0 ? (
            deliveryNotes.map((note) => (
              <tr key={note.id}>
                <td className="border px-4 py-2">{note.note_number}</td>
                <td className="border px-4 py-2">
                  {format(new Date(note.date), "dd/MM/yyyy")}
                </td>
                <td className="border px-4 py-2">{note.client_name}</td>
                <td className="border px-4 py-2">{note.total_quantity}</td>
                <td className="border px-4 py-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onViewDocument(note)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <PrintDocument documentType="delivery-notes" document={note} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border px-4 py-2 text-center">
                No delivery notes found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
