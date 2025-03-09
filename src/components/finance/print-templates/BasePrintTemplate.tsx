
import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy");
  } catch (e) {
    return dateString;
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0
  }).format(amount);
};

interface SignatureBlockProps {
  label: string;
  name?: string;
}

export function SignatureBlock({ label, name }: SignatureBlockProps) {
  return (
    <div>
      <p><strong>{label}:</strong> ___________________</p>
      {name && <p className="text-sm text-gray-500 mt-1">{name}</p>}
    </div>
  );
}
