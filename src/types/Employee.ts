
export type PaymentType = "salary" | "daily" | "weekly" | "monthly";

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  contact_number: string;
  hire_date: string;
  salary: number;
  payment_type: PaymentType;
  created_at: string;
}

export interface EmployeeFormValues {
  name: string;
  position: string;
  email: string;
  contact_number: string;
  hire_date: string;
  salary: number;
  payment_type: PaymentType;
}
