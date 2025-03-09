import React, { useState, useEffect } from "react";
import axios from "axios";

const IncomeStatementPage = () => {
  const [summary, setSummary] = useState(null);
  const [detailed, setDetailed] = useState([]);

  useEffect(() => {
    axios.get("/api/income-statement").then((response) => {
      setSummary(response.data.summary);
      setDetailed(response.data.detailed);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Income Statement</h1>
      {/* Summary */}
      {summary && (
        <div className="my-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold">Summary</h2>
          <p>Total Revenue: {summary.total_revenue}</p>
          <p>Total Expenses: {summary.total_expenses}</p>
          <p>Net Income: {summary.net_income}</p>
        </div>
      )}
      {/* Detailed View */}
      <div>
        <h2 className="font-semibold mb-2">Detailed Income Statement</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {detailed.map((entry, index) => (
              <tr key={index} className="border-b">
                <td>{entry.date}</td>
                <td>{entry.description}</td>
                <td>{entry.amount}</td>
                <td>{entry.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeStatementPage;
