
import { StockCategories } from "@/components/stock/StockCategories";
import { QuickActions } from "@/components/stock/QuickActions";

const Index = () => {
  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor and manage your pole inventory efficiently
        </p>
      </div>

      <StockCategories />
      <QuickActions />
    </div>
  );
};

export default Index;
