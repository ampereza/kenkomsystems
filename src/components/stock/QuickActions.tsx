
import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowLeftRight,
  Users,
  DollarSign,
  TestTube2,
  Users2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="mt-8 space-y-8">
      {/* Stock Management Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Stock Management</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
            onClick={() => navigate("/stock/receive")}
          >
            <ArrowDownToLine className="h-6 w-6" />
            <span>Receive Stock</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
            onClick={() => navigate("/stock/sort")}
          >
            <ArrowRightLeft className="h-6 w-6" />
            <span>Sort Stock</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
            onClick={() => navigate("/stock/receive-sorted")}
          >
            <ArrowLeftRight className="h-6 w-6" />
            <span>Receive Sorted</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
            onClick={() => navigate("/stock/suppliers")}
          >
            <Users className="h-6 w-6" />
            <span>Suppliers</span>
          </Button>
        </div>
      </div>

      {/* Financial Management Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Financial Management</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
            onClick={() => navigate("/finance/transactions")}
          >
            <DollarSign className="h-6 w-6" />
            <span>Transactions</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
            onClick={() => navigate("/finance/expenses")}
          >
            <DollarSign className="h-6 w-6" />
            <span>Expenses</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
            onClick={() => navigate("/finance/employees")}
          >
            <Users2 className="h-6 w-6" />
            <span>Employees</span>
          </Button>
        </div>
      </div>

      {/* Treatment Management Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Treatment Management</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
            onClick={() => navigate("/treatment/operations")}
          >
            <TestTube2 className="h-6 w-6" />
            <span>Treatment Operations</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
