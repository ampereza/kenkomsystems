
export interface Client {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
}

export interface ClientStock {
  id: string;
  client_id: string;
  created_at: string | null;
  updated_at: string | null;
  untreated_telecom_poles: number;
  untreated_9m_poles: number;
  untreated_10m_poles: number;
  untreated_11m_poles: number;
  untreated_12m_poles: number;
  untreated_14m_poles: number;
  untreated_16m_poles: number;
  treated_telecom_poles: number;
  treated_9m_poles: number;
  treated_10m_poles: number;
  treated_11m_poles: number;
  treated_12m_poles: number;
  treated_14m_poles: number;
  treated_16m_poles: number;
  delivered_telecom_poles: number;
  delivered_9m_poles: number;
  delivered_10m_poles: number;
  delivered_11m_poles: number;
  delivered_12m_poles: number;
  delivered_14m_poles: number;
  delivered_16m_poles: number;
  notes: string | null;
}
