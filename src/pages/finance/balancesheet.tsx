import React, { useState, useEffect } from "react";
import axios from "axios";

const BalanceSheetPage = () => {
  const [summary, setSummary] = useState(null);
  const [detailed, setDetailed] = useState([]);

  useEffect(() => {
    axios.get("/api/balance-sheet").then((response) => {
      setSummary(response.data.summary);
      setDetailed(response.data.detailed);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Balance Sheet</h1>
      {/* Summary */}
      {summary && (
        <div className="my-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold">Summary</h2>
          <p>Total Assets: {summary.total_assets}</p>
          <p>Total Liabilities: {summary.total_liabilities}</p>
          <p>Total Equity: {summary.total_equity}</p>
        </div>
      )}
      {/* Detailed View */}
      <div>
        <h2 className="font-semibold mb-2">Detailed Balance Sheet</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {detailed.map((entry, index) => (
              <tr key={index} className="border-b">
                <td>{entry.category}</td>
                <td>{entry.description}</td>
                <td>{entry.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceSheetPage;
