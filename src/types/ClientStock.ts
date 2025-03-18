
export interface ClientPolesStock {
  id: string;
  client_id: string;
  quantity: number;
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
  created_at: string;
  updated_at: string;
  notes?: string;
}
