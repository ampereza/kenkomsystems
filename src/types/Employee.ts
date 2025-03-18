
export type PaymentType = "salary" | "daily" | "weekly" | "monthly";

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  contact_number: string;
  hire_date: string;
  payment_type: PaymentType;
  salary: number;
  created_at: string;
}
