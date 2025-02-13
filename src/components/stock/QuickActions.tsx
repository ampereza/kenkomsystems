
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRightLeft, AlertTriangle, Truck } from "lucide-react";

export function QuickActions() {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
        >
          <PlusCircle className="h-6 w-6" />
          <span>Add Stock</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
        >
          <ArrowRightLeft className="h-6 w-6" />
          <span>Sort Stock</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
        >
          <AlertTriangle className="h-6 w-6" />
          <span>Mark Rejects</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-6 hover:bg-secondary"
        >
          <Truck className="h-6 w-6" />
          <span>Client Treatment</span>
        </Button>
      </div>
    </div>
  );
}
