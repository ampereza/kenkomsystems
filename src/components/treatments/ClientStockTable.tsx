
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientStockTableProps {
  clientId?: string;
}

interface ClientStockData {
  id: string;
  client_id: string;
  client_name: string;
  untreated_telecom_poles?: number;
  untreated_9m_poles?: number;
  untreated_10m_poles?: number;
  untreated_11m_poles?: number;
  untreated_12m_poles?: number;
  untreated_14m_poles?: number;
  untreated_16m_poles?: number;
  treated_telecom_poles?: number;
  treated_9m_poles?: number;
  treated_10m_poles?: number;
  treated_11m_poles?: number;
  treated_12m_poles?: number;
  treated_14m_poles?: number;
  treated_16m_poles?: number;
}

export function ClientStockTable({ clientId }: ClientStockTableProps) {
  const { toast } = useToast();
  const [clientStock, setClientStock] = useState<ClientStockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientStock = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("client_poles_stock")
          .select(`
            id,
            client_id,
            clients(name),
            untreated_telecom_poles,
            untreated_9m_poles,
            untreated_10m_poles,
            untreated_11m_poles,
            untreated_12m_poles,
            untreated_14m_poles,
            untreated_16m_poles,
            treated_telecom_poles,
            treated_9m_poles,
            treated_10m_poles,
            treated_11m_poles,
            treated_12m_poles,
            treated_14m_poles,
            treated_16m_poles
          `)
          .order('id', { ascending: false });
        
        if (clientId) {
          query = query.eq('client_id', clientId);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          // Transform the data to include client name
          const transformedData = data.map(item => ({
            ...item,
            client_name: item.clients?.name || "Unknown Client"
          }));
          
          setClientStock(transformedData);
        }
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

    fetchClientStock();
  }, [clientId, toast]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Telecom Poles</TableHead>
                <TableHead className="text-right">9m Poles</TableHead>
                <TableHead className="text-right">10m Poles</TableHead>
                <TableHead className="text-right">11m Poles</TableHead>
                <TableHead className="text-right">12m Poles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[60px] ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[60px] ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[60px] ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[60px] ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[60px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : clientStock.length > 0 ? (
                clientStock.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.client_name}</TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div>Untreated: {stock.untreated_telecom_poles || 0}</div>
                        <div>Treated: {stock.treated_telecom_poles || 0}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div>Untreated: {stock.untreated_9m_poles || 0}</div>
                        <div>Treated: {stock.treated_9m_poles || 0}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div>Untreated: {stock.untreated_10m_poles || 0}</div>
                        <div>Treated: {stock.treated_10m_poles || 0}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div>Untreated: {stock.untreated_11m_poles || 0}</div>
                        <div>Treated: {stock.treated_11m_poles || 0}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div>Untreated: {stock.untreated_12m_poles || 0}</div>
                        <div>Treated: {stock.treated_12m_poles || 0}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No stock records found
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
