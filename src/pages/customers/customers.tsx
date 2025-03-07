import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom"; // For navigation links

const Customer: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase.from("customers").select("*");

        if (error) {
          throw error;
        }

        setCustomers(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Customers</h1>
      <Link to="/customers/add">Add New Customer</Link>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <p>{customer.name}</p>
            <p>{customer.email}</p>
            <p>{customer.phone}</p>
            <p>{customer.address}</p>
            <Link to={`/customers/edit/${customer.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customer;
