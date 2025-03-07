import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useHistory } from "react-router-dom"; // For navigation

const AddCustomer: React.FC = () => {
  const history = useHistory(); // Used for navigation after adding the customer
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("customers") // Replace "customers" with your table name
        .insert([
          { name, email, phone, address },
        ]);

      if (error) {
        throw error;
      }

      // Redirect to the customer list page after adding the new customer
      history.push("/customers");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Customer</h1>
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
          {loading ? "Saving..." : "Save Customer"}
        </button>
      </form>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default AddCustomer;
