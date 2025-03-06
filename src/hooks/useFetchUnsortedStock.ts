
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { UnsortedStock } from "@/components/stock/SortStockForm";

export const useFetchUnsortedStock = () => {
  const { toast } = useToast();
  const [unsortedStocks, setUnsortedStocks] = useState<UnsortedStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnsortedStock = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("unsorted_stock")
        .select("*, suppliers(name)")
        .order("received_date", { ascending: false });

      if (error) {
        throw error;
      }

      setUnsortedStocks(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch unsorted stock",
        variant: "destructive",
      });
      console.error("Error fetching unsorted stock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnsortedStock();
  }, []);

  return { unsortedStocks, isLoading, refetch: fetchUnsortedStock };
};
