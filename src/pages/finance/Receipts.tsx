
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { ReceiptsTable } from "@/components/finance/documents/ReceiptsTable";

export default function Receipts() {
  return (
    <div>
      <FinancialNavbar />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Receipts</h1>
        </div>
        <ReceiptsTable />
      </main>
    </div>
  );
}
