
export interface TreatmentLog {
  id: string;
  date: string;
  cylinder_number: string;
  liters_added: string;
  kegs_added: number;
  kegs_remaining: number;
  strength_percentage: number;
  client_id?: string;
  total_poles: number;
  created_at: string;
  treatment_purpose: string;
  notes?: string;
}
