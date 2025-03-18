
import { useClients } from "@/hooks/useClients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViewClientStock() {
  const { clients, isLoading } = useClients();
  
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="container py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Client Stock</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading client stock...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map(client => (
              <Card key={client.id}>
                <CardHeader>
                  <CardTitle>{client.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>View stock details for this client</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
