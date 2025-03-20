
import React from 'react';
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { SortStockForm } from "@/components/stock/SortStockForm";
import { SortStockHeader } from "@/components/stock/SortStockHeader";
import { useFetchUnsortedStock } from "@/hooks/useFetchUnsortedStock";

export default function SortStock() {
  const { unsortedStocks, isLoading, refetch } = useFetchUnsortedStock();

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <SortStockHeader />
        <div className="mt-6">
          {isLoading ? (
            <div className="text-center py-4">Loading unsorted stock data...</div>
          ) : (
            <SortStockForm 
              unsortedStocks={unsortedStocks} 
              onSuccess={refetch} 
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
