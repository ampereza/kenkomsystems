
export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  hire_date: string;
  payment_type: "salary" | "daily" | "weekly" | "monthly";
  contact_number?: string;
  email?: string;
  created_at?: string;
}
