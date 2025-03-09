
export interface Client {
  id: string;  // Changed from number to string as Supabase UUIDs are strings
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

export interface ClientStock {
  id: string;  // Changed from number to string as Supabase UUIDs are strings
  client_id: string;  // Changed from number to string
  stock_type: string;
  quantity: number;
  description?: string;
  created_at: string;
}
