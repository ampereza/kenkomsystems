import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useParams, useHistory } from "react-router-dom"; // For routing
import { Customer } from "./types"; // Import Customer type (adjust if needed)

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get customer ID from URL params
  const history = useHistory(); // Used for navigation after saving
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data, error } = await supabase
          .from<Customer>("customers")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setCustomer(data || null);
        if (data) {
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone);
          setAddress(data.address);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("customers")
        .update({ name, email, phone, address })
        .eq("id", id);

      if (error) {
        throw error;
      }

      history.push("/customers");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading customer...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Edit Customer</h1>
      {customer && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditCustomer;
