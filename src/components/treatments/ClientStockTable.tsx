
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
  Search,
  Truck,
  RefreshCw 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

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
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedAndFilteredStock = [...clientStock]
    // Apply search filter
    .filter(stock => 
      searchQuery === "" || 
      stock.client_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // Apply sort
    .sort((a, b) => {
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

  const getFilteredValue = (stock: any, category: string) => {
    if (filterPoleType === "all") {
      return getTotalByCategory(stock, category);
    }
    return stock[`${category}_${filterPoleType}_poles`] || 0;
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
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" /> Client Stock
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
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
              {sortedAndFilteredStock.length > 0 ? (
                sortedAndFilteredStock.map((stock) => {
                  const untreatedTotal = getFilteredValue(stock, "untreated");
                  const treatedTotal = getFilteredValue(stock, "treated");
                  const deliveredTotal = getFilteredValue(stock, "delivered");
                  
                  // Skip rows with no stock if we're filtering
                  if (filterPoleType !== "all" && untreatedTotal === 0 && treatedTotal === 0 && deliveredTotal === 0) {
                    return null;
                  }

                  return (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        {stock.client_name}
                        {filterPoleType !== "all" && (
                          <Badge variant="outline" className="ml-2">
                            {filterPoleType} poles
                          </Badge>
                        )}
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onEdit(stock.id)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Edit Stock
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {onAddDelivery && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onAddDelivery(stock.id)}
                                    className="cursor-pointer"
                                  >
                                    <Truck className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Record Delivery
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {searchQuery ? (
                      <>No clients found matching "{searchQuery}". Try a different search.</>
                    ) : (
                      <>No client stock found. Add stock to clients to see it here.</>
                    )}
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
