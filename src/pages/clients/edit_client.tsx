import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useParams, useHistory } from "react-router-dom";  // For routing
import { Client } from "./types"; // Import Client interface

const EditClient: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get client ID from route params
  const history = useHistory();  // Used to navigate after updating
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States to manage form input values
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // Fetch the client details from Supabase based on the client ID
    const fetchClient = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from<Client>("clients")
          .select("*")
          .eq("id", id)
          .single(); // Fetch a single client based on ID
        if (error) {
          throw error;
        }
        setClient(data || null);
        if (data) {
          setName(data.name);
          setEmail(data.email);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Update the client record in Supabase
    try {
      const { data, error } = await supabase
        .from<Client>("clients")
        .update({ name, email })
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Navigate back to the client list after successful update
      history.push("/clients");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading client details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Edit Client</h1>
      {client && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default EditClient;
