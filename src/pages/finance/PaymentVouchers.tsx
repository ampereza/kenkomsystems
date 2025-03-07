
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";

export default function PaymentVouchers() {
  return (
    <div className="min-h-screen flex flex-col">
      <FinancialNavbar />
      <main className="container py-4 md:py-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Payment Vouchers</h1>
        </div>
        <p>Payment vouchers functionality will be implemented soon.</p>
      </main>
    </div>
  );
}
