
export type PoleCategory = "fencing" | "telecom" | "distribution" | "high_voltage";
export type PoleSize = "small" | "medium" | "stout";
export type LengthUnit = "ft" | "m";

export interface UnsortedStock {
  id: string;
  quantity: number;
  supplier_id: string | null;
  received_date: string;
  notes: string | null;
  created_at: string | null;
  suppliers?: { name: string };
}

export interface FormData {
  unsorted_stock_id: string;
  category: PoleCategory | "";
  size: PoleSize | null;
  length_value: string;
  length_unit: LengthUnit | null;
  diameter_mm: string;
  quantity: string;
  notes: string;
}

export const CATEGORIES: { value: PoleCategory; label: string }[] = [
  { value: "fencing", label: "Fencing Poles" },
  { value: "telecom", label: "Telecom Poles" },
  { value: "distribution", label: "Distribution Poles" },
  { value: "high_voltage", label: "High Voltage Poles" },
];

export const SIZES: { value: PoleSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "stout", label: "Stout" },
];
