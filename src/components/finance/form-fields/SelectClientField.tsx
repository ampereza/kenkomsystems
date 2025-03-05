
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

interface Client {
  id: string;
  name: string;
}

interface SelectClientFieldProps {
  onClientSelect: (clientId: string) => void;
  label?: string;
  required?: boolean;
}

export function SelectClientField({ onClientSelect, label = "Select Client", required = false }: SelectClientFieldProps) {
  const [clients, setClients] = useState<Client[]>([]);
  
  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");
      
      if (!error && data) {
        setClients(data);
      }
    };
    
    fetchClients();
  }, []);
  
  return (
    <FormItem>
      <FormLabel>{label}{required && '*'}</FormLabel>
      <Select onValueChange={onClientSelect}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {clients.map(client => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
}
