import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Client } from "./types"; // Import the Client interface

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from<Client>("clients").select("*");
        if (error) {
          throw error;
        }
        setClients(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Loading clients...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Clients List</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <p>{client.name}</p>
            <p>{client.telepnone}</p>
            {/* Add any other fields you want to display */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;
