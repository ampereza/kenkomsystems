import React, { useState, useEffect } from "react";
import axios from "axios";

const GeneralLedgerPage = () => {
  const [summary, setSummary] = useState(null);
  const [detailed, setDetailed] = useState([]);

  useEffect(() => {
    // Fetch Ledger Data
    axios.get("/api/ledger").then((response) => {
      setSummary(response.data.summary);
      setDetailed(response.data.detailed);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">General Ledger</h1>
      {/* Summary */}
      {summary && (
        <div className="my-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold">Summary</h2>
          <p>Total Debits: {summary.total_debits}</p>
          <p>Total Credits: {summary.total_credits}</p>
          <p>Balance: {summary.balance}</p>
        </div>
      )}
      {/* Detailed View */}
      <div>
        <h2 className="font-semibold mb-2">Detailed Transactions</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th>Date</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {detailed.map((entry, index) => (
              <tr key={index} className="border-b">
                <td>{entry.date}</td>
                <td>{entry.description}</td>
                <td>{entry.debit}</td>
                <td>{entry.credit}</td>
                <td>{entry.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralLedgerPage;
