
import { useState } from "react";
import { TreatmentNavbar } from "@/components/navigation/TreatmentNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientStockForm } from "@/components/treatments/ClientStockForm";
import { ClientStockTable } from "@/components/treatments/ClientStockTable";
import { ClientDeliveryForm } from "@/components/treatments/ClientDeliveryForm";

export default function ClientStock() {
  const [activeTab, setActiveTab] = useState("view");
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();

  const handleEditClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setActiveTab("update");
  };

  const handleAddDelivery = (clientId: string) => {
    setSelectedClientId(clientId);
    setActiveTab("deliver");
  };

  const handleFormSuccess = () => {
    setActiveTab("view");
    setSelectedClientId(undefined);
  };

  return (
    <>
      <TreatmentNavbar />
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Client Stock Management</h1>
          <p className="text-muted-foreground">
            Manage client stock inventory, add stock, and record deliveries
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="view">View Stock</TabsTrigger>
            <TabsTrigger value="update">Update Stock</TabsTrigger>
            <TabsTrigger value="deliver">Record Delivery</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <ClientStockTable 
              onEdit={handleEditClient} 
              onAddDelivery={handleAddDelivery} 
            />
          </TabsContent>

          <TabsContent value="update">
            <ClientStockForm 
              onSuccess={handleFormSuccess} 
              clientId={selectedClientId} 
            />
          </TabsContent>

          <TabsContent value="deliver">
            <ClientDeliveryForm 
              onSuccess={handleFormSuccess} 
              clientId={selectedClientId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
