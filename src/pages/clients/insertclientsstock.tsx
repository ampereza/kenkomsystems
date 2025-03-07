import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { ClientStock } from "./types";

const InsertClientStock: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  const handleInsert = async () => {
    const newRecord: ClientStock = {
      id: "4993926c-fe72-439e-a411-f644913a4f16",
      client_id: "a939efde-b074-4195-9e8f-d6a2d9ef3898",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      untreated_telecom_poles: 0,
      untreated_9m_poles: 0,
      untreated_10m_poles: 0,
      untreated_11m_poles: 0,
      untreated_12m_poles: 0,
      untreated_14m_poles: 0,
      untreated_16m_poles: 0,
      treated_telecom_poles: 30,
      treated_9m_poles: 0,
      treated_10m_poles: 0,
      treated_11m_poles: 0,
      treated_12m_poles: 0,
      treated_14m_poles: 0,
      treated_16m_poles: 0,
      delivered_telecom_poles: 0,
      delivered_9m_poles: 0,
      delivered_10m_poles: 0,
      delivered_11m_poles: 0,
      delivered_12m_poles: 0,
      delivered_14m_poles: 0,
      delivered_16m_poles: 0,
      notes: null,
    };

    try {
      const { data, error } = await supabase.from<ClientStock>("client_stock").insert([newRecord]);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Record inserted successfully!");
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`);
    }
  };

  return (
    <div>
      <button onClick={handleInsert} className="btn btn-primary">
        Insert Client Stock
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default InsertClientStock;
