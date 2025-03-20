
import React from 'react';
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { SortStockForm } from "@/components/stock/SortStockForm";
import { SortStockHeader } from "@/components/stock/SortStockHeader";

export default function SortStock() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <SortStockHeader />
        <div className="mt-6">
          <SortStockForm />
        </div>
      </div>
    </DashboardLayout>
  );
}
