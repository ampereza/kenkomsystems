
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StockMetricCard } from "@/components/stock/StockMetricCard";
import { QuickActions } from "@/components/stock/QuickActions";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const { data: unsortedStock, error: unsortedError } = useQuery({
    queryKey: ["unsorted-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unsorted_stock")
        .select("quantity")
        .not("quantity", "eq", 0);
      
      if (error) {
        console.error("Error fetching unsorted stock:", error);
        throw error;
      }
      return data?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch unsorted stock data",
        variant: "destructive",
      });
    },
  });

  const { data: sortedStock, error: sortedError } = useQuery({
    queryKey: ["sorted-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sorted_stock")
        .select("quantity")
        .not("quantity", "eq", 0)
        .neq("category", "rejected");
      
      if (error) {
        console.error("Error fetching sorted stock:", error);
        throw error;
      }
      return data?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch sorted stock data",
        variant: "destructive",
      });
    },
  });

  const { data: rejects, error: rejectsError } = useQuery({
    queryKey: ["rejects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sorted_stock")
        .select("quantity")
        .eq("category", "rejected")
        .not("quantity", "eq", 0);
      
      if (error) {
        console.error("Error fetching rejects:", error);
        throw error;
      }
      return data?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch rejects data",
        variant: "destructive",
      });
    },
  });

  const categories = [
    {
      title: "Unsorted Stock",
      value: unsortedStock || 0,
      change: { value: 0, type: "increase" as const },
    },
    {
      title: "Sorted Stock",
      value: sortedStock || 0,
      change: { value: 0, type: "increase" as const },
    },
    {
      title: "Rejects",
      value: rejects || 0,
      change: { value: 0, type: "decrease" as const },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto p-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Stock Overview</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor and manage your pole inventory efficiently
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <StockMetricCard
              key={category.title}
              title={category.title}
              value={category.value}
              change={category.change}
            />
          ))}
        </div>

        <QuickActions />
      </div>
    </div>
  );
};

export default Index;
