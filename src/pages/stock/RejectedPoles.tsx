
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function RejectedPoles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deliveryNote, setDeliveryNote] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: rejectedPoles, isLoading } = useQuery({
    queryKey: ["rejected-poles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rejected_poles_with_suppliers")
        .select(`
          *,
          suppliers (
            name,
            contact_person,
            phone
          )
        `)
        .is("collected_date", null)
        .order("sorting_date", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching rejected poles",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  const markAsCollectedMutation = useMutation({
    mutationFn: async ({ id, deliveryNote }: { id: string; deliveryNote: string }) => {
      const { error } = await supabase
        .from("rejected_poles_with_suppliers")
        .update({
          collected_date: new Date().toISOString(),
          delivery_note_number: deliveryNote,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rejected-poles"] });
      toast({
        title: "Success",
        description: "Poles marked as collected",
      });
      setDeliveryNote("");
      setSelectedId(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update: " + error.message,
      });
    },
  });

  const handleMarkAsCollected = (id: string) => {
    if (!deliveryNote) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a delivery note number",
      });
      return;
    }

    markAsCollectedMutation.mutate({ id, deliveryNote });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rejected Poles with Suppliers</h1>
        <p className="mt-2 text-muted-foreground">
          Track rejected poles that need to be collected by suppliers
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : rejectedPoles && rejectedPoles.length > 0 ? (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">Supplier</th>
                <th className="text-left p-4">Contact Person</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Quantity</th>
                <th className="text-left p-4">Sorting Date</th>
                <th className="text-left p-4">Notes</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rejectedPoles.map((pole) => (
                <tr key={pole.id} className="border-t">
                  <td className="p-4">{pole.suppliers?.name}</td>
                  <td className="p-4">{pole.suppliers?.contact_person}</td>
                  <td className="p-4">{pole.suppliers?.phone}</td>
                  <td className="p-4">{pole.quantity}</td>
                  <td className="p-4">
                    {new Date(pole.sorting_date!).toLocaleDateString()}
                  </td>
                  <td className="p-4">{pole.notes}</td>
                  <td className="p-4">
                    {selectedId === pole.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Delivery note #"
                          value={deliveryNote}
                          onChange={(e) => setDeliveryNote(e.target.value)}
                          className="w-36"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsCollected(pole.id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedId(pole.id)}
                      >
                        Mark as Collected
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No rejected poles pending collection
        </div>
      )}
    </div>
  );
}
