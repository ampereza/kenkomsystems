
import { Card, CardContent } from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
}

interface ClientsListProps {
  clients: Client[];
}

export function ClientsList({ clients }: ClientsListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Existing Clients</h2>
      <div className="space-y-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-medium">{client.name}</h3>
              {client.contact_person && (
                <p className="text-sm">Contact: {client.contact_person}</p>
              )}
              {client.email && (
                <p className="text-sm">Email: {client.email}</p>
              )}
              {client.phone && (
                <p className="text-sm">Phone: {client.phone}</p>
              )}
              {client.address && (
                <p className="text-sm">Address: {client.address}</p>
              )}
              {client.notes && (
                <p className="text-sm text-muted-foreground">{client.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {clients.length === 0 && (
          <p className="text-muted-foreground">No clients added yet.</p>
        )}
      </div>
    </div>
  );
}
