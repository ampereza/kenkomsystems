
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
  
  // Additional fields that might be used in some components
  chemical_type?: string;
  concentration?: number;
  operator_name?: string;
  poles_treated?: number;
  
  // Pole type fields
  poles_10m?: number;
  poles_11m?: number;
  poles_12m?: number;
  poles_14m?: number;
  poles_16m?: number;
  poles_9m?: number;
  poles_telecom?: number;
}
