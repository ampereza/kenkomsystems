
import { Card, CardContent } from "@/components/ui/card";
import { ClientsHeader } from "@/components/treatments/ClientsHeader";
import { ClientForm } from "@/components/treatments/ClientForm";
import { ClientsList } from "@/components/treatments/ClientsList";
import { useClients } from "@/hooks/useClients";
import { TreatmentNavbar } from "@/components/navigation/TreatmentNavbar";

const Clients = () => {
  const { clients, fetchClients } = useClients();

  return (
    <>
      <TreatmentNavbar />
      <div className="container mx-auto p-6">
        <ClientsHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ClientForm onClientAdded={fetchClients} />
          <ClientsList clients={clients} />
        </div>
      </div>
    </>
  );
};

export default Clients;
