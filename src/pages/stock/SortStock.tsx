
import { Card, CardContent } from "@/components/ui/card";
import { SortStockHeader } from "@/components/stock/SortStockHeader";
import { SortStockForm } from "@/components/stock/SortStockForm";
import { useFetchUnsortedStock } from "@/hooks/useFetchUnsortedStock";

const SortStock = () => {
  const { unsortedStocks, isLoading, refetch } = useFetchUnsortedStock();

  return (
    <div className="container mx-auto p-6">
      <SortStockHeader />
      
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p>Loading unsorted stock...</p>
          ) : (
            <SortStockForm 
              unsortedStocks={unsortedStocks} 
              onSuccess={refetch} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SortStock;
