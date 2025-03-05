
import { useEffect, useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Supplier {
  id: string;
  name: string;
}

interface SelectSupplierFieldProps {
  onSupplierSelect: (supplierId: string) => void;
  label?: string;
  required?: boolean;
}

export function SelectSupplierField({ onSupplierSelect, label = "Select Supplier", required = false }: SelectSupplierFieldProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  useEffect(() => {
    const fetchSuppliers = async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name");
      
      if (!error && data) {
        setSuppliers(data);
      }
    };
    
    fetchSuppliers();
  }, []);
  
  return (
    <FormItem>
      <FormLabel>{label}{required && '*'}</FormLabel>
      <Select onValueChange={onSupplierSelect}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {suppliers.map(supplier => (
            <SelectItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
}
