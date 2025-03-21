
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, ArrowDown, ArrowUp } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClients } from "@/hooks/useClients";
import { StockMetricCard } from "@/components/stock/StockMetricCard";
import { ClientPolesStock } from "@/types/ClientStock";

export default function StockDashboard() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { clients, isLoading: isClientsLoading } = useClients();
  
  const { data: stockSummary, isLoading } = useQuery({
    queryKey: ["stock-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_movements")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: stockCounts } = useQuery({
    queryKey: ["stock-counts"],
    queryFn: async () => {
      // This would be replaced with actual data from your API
      return {
        totalStock: "3,456",
        treated: "1,890",
        untreated: "1,566",
        inTreatment: "120",
        rejected: "48",
        pendingDelivery: "210"
      };
    },
  });

  const { data: clientStock } = useQuery({
    queryKey: ["client-stock", selectedClient],
    enabled: !!selectedClient,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_poles_stock")
        .select("*")
        .eq("client_id", selectedClient)
        .single();

      if (error) throw error;
      return data as ClientPolesStock;
    },
  });

  const stockCategories = [
    "7m", "8m", "9m", "10m", "11m", "12m", "14m", "16m", "rafter", "timber", "fencing poles"
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Stock Management Dashboard</h1>
          <div className="flex items-center">
            <div className="bg-orange-100 text-orange-600 border border-orange-300 rounded-md px-4 py-2">
              sort by: date
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-orange-400 bg-orange-50">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-orange-600">total stock</h3>
                <p className="text-3xl font-bold">{stockCounts?.totalStock || "-"}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-400 bg-orange-50">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-orange-600">total treated</h3>
                <p className="text-3xl font-bold">{stockCounts?.treated || "-"}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-400 bg-orange-50">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-orange-600">total untreated</h3>
                <p className="text-3xl font-bold">{stockCounts?.untreated || "-"}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stock Details */}
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6">
          <Tabs defaultValue="kdl">
            <TabsList className="mb-4 flex space-x-4">
              <TabsTrigger value="kdl" className="border-2 border-blue-500 bg-white rounded-md px-8 py-2 data-[state=active]:bg-blue-100">
                kdl
              </TabsTrigger>
              <TabsTrigger value="client" className="border-2 border-blue-500 bg-white rounded-md px-8 py-2 data-[state=active]:bg-blue-100">
                client
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kdl" className="mt-4">
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4">
                <div className="flex mb-4 space-x-2">
                  <div className="border-2 border-blue-500 bg-white rounded-md px-8 py-2 text-blue-600 font-bold">
                    category
                  </div>
                  <div className="border-2 border-orange-300 bg-orange-50 rounded-md px-8 py-2 text-orange-600 font-bold">
                    untreat
                  </div>
                  <div className="border-2 border-orange-300 bg-orange-50 rounded-md px-8 py-2 text-orange-600 font-bold">
                    treated
                  </div>
                  <div className="border-2 border-orange-300 bg-orange-50 rounded-md px-8 py-2 text-orange-600 font-bold">
                    unsorted
                  </div>
                  <div className="border-2 border-orange-300 bg-orange-50 rounded-md px-8 py-2 text-orange-600 font-bold">
                    total
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/5 border-2 border-blue-500 rounded-xl p-4 text-blue-600">
                    <ul className="space-y-3">
                      {stockCategories.map((category) => (
                        <li key={category} className="font-bold">{category}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-4/5 p-6">
                    <p className="text-blue-600 font-medium">
                      note: on the client side, we add a selection table to select client by name and return all the required columns
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="client" className="mt-4">
              {!selectedClient ? (
                <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Select a Client</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.map((client) => (
                      <div 
                        key={client.id}
                        onClick={() => setSelectedClient(client.id)}
                        className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer hover:bg-blue-50"
                      >
                        <p className="font-bold">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.contact_person}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {clients.find(c => c.id === selectedClient)?.name} Stock
                    </h3>
                    <button 
                      onClick={() => setSelectedClient(null)}
                      className="text-blue-600 hover:underline"
                    >
                      Change Client
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border border-orange-300">Category</TableHead>
                          <TableHead className="border border-orange-300">Untreated</TableHead>
                          <TableHead className="border border-orange-300">Treated</TableHead>
                          <TableHead className="border border-orange-300">Delivered</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="border border-orange-300">Telecom Poles</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.untreated_telecom_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.treated_telecom_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="border border-orange-300">9m Poles</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.untreated_9m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.treated_9m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="border border-orange-300">10m Poles</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.untreated_10m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.treated_10m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="border border-orange-300">11m Poles</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.untreated_11m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.treated_11m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="border border-orange-300">12m Poles</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.untreated_12m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.treated_12m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="border border-orange-300">14m Poles</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.untreated_14m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.treated_14m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="border border-orange-300">16m Poles</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.untreated_16m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">{clientStock?.treated_16m_poles || 0}</TableCell>
                          <TableCell className="border border-orange-300">-</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
