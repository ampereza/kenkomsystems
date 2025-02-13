
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ReceiveStock = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    supplier: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("unsorted_stock").insert([
        {
          quantity: parseInt(formData.quantity),
          supplier: formData.supplier || null,
          notes: formData.notes || null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock received successfully",
      });

      navigate("/stock/sort");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to receive stock",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Receive Unsorted Stock</h1>
        <p className="mt-2 text-muted-foreground">
          Record newly received unsorted poles
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="quantity">
            Quantity*
          </label>
          <Input
            id="quantity"
            type="number"
            required
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="supplier">
            Supplier
          </label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) =>
              setFormData({ ...formData, supplier: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="notes">
            Notes
          </label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Receiving..." : "Receive Stock"}
        </Button>
      </form>
    </div>
  );
};

export default ReceiveStock;
