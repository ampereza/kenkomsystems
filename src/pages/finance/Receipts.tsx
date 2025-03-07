
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { ReceiptsTable } from "@/components/finance/documents/ReceiptsTable";

export default function Receipts() {
  return (
    <div className="min-h-screen flex flex-col">
      <FinancialNavbar />
      <main className="container py-4 md:py-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Receipts</h1>
        </div>
        <ReceiptsTable />
      </main>
    </div>
  );
}

import React, { useState } from "react";
import { supabase } from "./supabaseClient"; // Ensure this is set up for Supabase
import { useHistory } from "react-router-dom";

const AddReceipt: React.FC = () => {
  const history = useHistory();
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [receivedFrom, setReceivedFrom] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [forPayment, setForPayment] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("receipts")
        .insert([
          {
            receipt_number: receiptNumber,
            date,
            received_from: receivedFrom,
            amount,
            for_payment: forPayment,
            payment_method: paymentMethod,
            signature,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        throw error;
      }

      // Redirect after successfully adding the receipt
      history.push("/receipts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Receipt</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Receipt Number</label>
          <input
            type="text"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Received From</label>
          <input
            type="text"
            value={receivedFrom}
            onChange={(e) => setReceivedFrom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>For Payment</label>
          <input
            type="text"
            value={forPayment || ""}
            onChange={(e) => setForPayment(e.target.value || null)}
          />
        </div>
        <div>
          <label>Payment Method</label>
          <input
            type="text"
            value={paymentMethod || ""}
            onChange={(e) => setPaymentMethod(e.target.value || null)}
          />
        </div>
        <div>
          <label>Signature</label>
          <input
            type="text"
            value={signature || ""}
            onChange={(e) => setSignature(e.target.value || null)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Receipt"}
        </button>
      </form>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default AddReceipt;
