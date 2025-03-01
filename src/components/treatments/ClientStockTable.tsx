
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpDown, 
  Edit, 
  Package, 
  Truck 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ClientStockTableProps {
  onEdit?: (clientId: string) => void;
  onAddDelivery?: (clientId: string) => void;
}

export function ClientStockTable({ onEdit, onAddDelivery }: ClientStockTableProps) {
  const { toast } = useToast();
  const [clientStock, setClientStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("client_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterPoleType, setFilterPoleType] = useState<string>("all");

  const fetchClientStock = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("client_stock_summary")
        .select("*");

      if (error) {
        throw error;
      }

      setClientStock(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching client stock",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientStock();
  }, []);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedStock = [...clientStock].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getTotalByCategory = (stock: any, category: string) => {
    const categories = [
      "telecom_poles",
      "9m_poles",
      "10m_poles",
      "11m_poles",
      "12m_poles",
      "14m_poles",
      "16m_poles",
    ];

    return categories.reduce((total, poleType) => {
      return total + (stock[`${category}_${poleType}`] || 0);
    }, 0);
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "-";
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Stock</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={filterPoleType} onValueChange={setFilterPoleType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by pole type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pole Types</SelectItem>
              <SelectItem value="telecom">Telecom Poles</SelectItem>
              <SelectItem value="9m">9m Poles</SelectItem>
              <SelectItem value="10m">10m Poles</SelectItem>
              <SelectItem value="11m">11m Poles</SelectItem>
              <SelectItem value="12m">12m Poles</SelectItem>
              <SelectItem value="14m">14m Poles</SelectItem>
              <SelectItem value="16m">16m Poles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("client_name")}
                >
                  Client
                  {sortBy === "client_name" && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead className="text-right">Untreated</TableHead>
                <TableHead className="text-right">Treated</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStock.length > 0 ? (
                sortedStock.map((stock) => {
                  // Filter logic for pole types
                  if (
                    filterPoleType !== "all" &&
                    stock[`untreated_${filterPoleType}_poles`] === 0 &&
                    stock[`treated_${filterPoleType}_poles`] === 0 &&
                    stock[`delivered_${filterPoleType}_poles`] === 0
                  ) {
                    return null;
                  }

                  const untreatedTotal = filterPoleType === "all" 
                    ? getTotalByCategory(stock, "untreated") 
                    : stock[`untreated_${filterPoleType}_poles`] || 0;
                    
                  const treatedTotal = filterPoleType === "all" 
                    ? getTotalByCategory(stock, "treated") 
                    : stock[`treated_${filterPoleType}_poles`] || 0;
                    
                  const deliveredTotal = filterPoleType === "all" 
                    ? getTotalByCategory(stock, "delivered") 
                    : stock[`delivered_${filterPoleType}_poles`] || 0;

                  return (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        {stock.client_name}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(untreatedTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(treatedTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(deliveredTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {onEdit && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onEdit(stock.id)}
                              title="Edit Stock"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onAddDelivery && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onAddDelivery(stock.id)}
                              title="Record Delivery"
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No client stock found. Add stock to clients to see it here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
