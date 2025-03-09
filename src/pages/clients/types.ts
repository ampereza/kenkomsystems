
export interface Client {
  id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

export interface ClientStock {
  id: number;
  client_id: number;
  stock_type: string;
  quantity: number;
  description?: string;
  created_at: string;
}
