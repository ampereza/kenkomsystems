
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, Calendar, DollarSign } from "lucide-react";
import { ViewDocumentDialog } from "./ViewDocumentDialog";
import { useState } from "react";
import { ReceiptDialog } from "@/components/receipts/ReceiptDialog";

interface Receipt {
  id: string;
  receipt_number: string;
  date: string;
  received_from: string;
  amount: number;
  payment_method?: string;
  created_at: string;
  for_payment: string;
  signature?: string;
}

interface ReceiptsTableProps {
  receipts?: Receipt[];
}

export function ReceiptsTable({ receipts = [] }: ReceiptsTableProps) {
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleView = async (id: string) => {
    setSelectedReceiptId(id);
    // Fetch the selected receipt
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching receipt:", error);
      return;
    }
    
    setSelectedReceipt(data);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ReceiptDialog />
      </div>
      
      {receipts && receipts.length > 0 ? (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">Receipt No.</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Received From</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Payment Method</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="border-t">
                  <td className="p-4">{receipt.receipt_number}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(receipt.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">{receipt.received_from}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      {Number(receipt.amount).toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4">{receipt.payment_method || "Cash"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleView(receipt.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="p-8 text-center text-muted-foreground">
          No receipts found. Create your first receipt by clicking "New Receipt".
        </Card>
      )}
      
      {selectedReceipt && dialogOpen && (
        <ViewDocumentDialog
          documentType="receipts"
          document={selectedReceipt}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setSelectedReceiptId(null);
              setSelectedReceipt(null);
            }
          }}
        />
      )}
    </div>
  );
}
