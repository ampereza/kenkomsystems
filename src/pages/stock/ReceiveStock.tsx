
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Supplier {
  id: string;
  name: string;
}

const ReceiveStock = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    supplier_id: "",
    notes: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const { data, error } = await supabase
      .from("suppliers")
      .select("id, name")
      .order("name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch suppliers",
        variant: "destructive",
      });
      return;
    }

    setSuppliers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("unsorted_stock").insert({
        quantity: parseInt(formData.quantity),
        supplier_id: formData.supplier_id || null,
        notes: formData.notes || null,
      });

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
          <label className="text-sm font-medium">Supplier</label>
          <Select
            value={formData.supplier_id}
            onValueChange={(value) =>
              setFormData({ ...formData, supplier_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={() => navigate("/stock/suppliers")}
            >
              Manage suppliers
            </Button>
          </p>
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
