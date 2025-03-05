
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { format } from "date-fns";

// Types for our documents
type DeliveryNote = {
  id: string;
  note_number: string;
  date: string;
  client_name: string;
  total_quantity: number;
};

type PaymentVoucher = {
  id: string;
  voucher_number: string;
  date: string;
  paid_to: string;
  total_amount: number;
};

type ExpenseAuthorization = {
  id: string;
  authorization_number: string;
  date: string;
  received_from: string;
  sum_of_shillings: number;
};

type Receipt = {
  id: string;
  receipt_number: string;
  date: string;
  received_from: string;
  amount: number;
};

export default function Documents() {
  const [activeTab, setActiveTab] = useState("delivery-notes");

  // Fetch delivery notes
  const { data: deliveryNotes, isLoading: isLoadingDeliveryNotes } = useQuery({
    queryKey: ["delivery-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DeliveryNote[];
    },
    enabled: activeTab === "delivery-notes",
  });

  // Fetch payment vouchers
  const { data: paymentVouchers, isLoading: isLoadingPaymentVouchers } = useQuery({
    queryKey: ["payment-vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PaymentVoucher[];
    },
    enabled: activeTab === "payment-vouchers",
  });

  // Fetch expense authorizations
  const { data: expenseAuths, isLoading: isLoadingExpenseAuths } = useQuery({
    queryKey: ["expense-authorizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expense_authorizations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ExpenseAuthorization[];
    },
    enabled: activeTab === "expense-authorizations",
  });

  // Fetch receipts
  const { data: receipts, isLoading: isLoadingReceipts } = useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Receipt[];
    },
    enabled: activeTab === "receipts",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <FinancialNavbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Financial Documents</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="delivery-notes">Delivery Notes</TabsTrigger>
            <TabsTrigger value="payment-vouchers">Payment Vouchers</TabsTrigger>
            <TabsTrigger value="expense-authorizations">Expense Authorizations</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
          </TabsList>

          <TabsContent value="delivery-notes">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Notes</CardTitle>
                <CardDescription>
                  View and manage all delivery notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Note #</th>
                        <th className="border px-4 py-2 text-left">Date</th>
                        <th className="border px-4 py-2 text-left">Client</th>
                        <th className="border px-4 py-2 text-left">Quantity</th>
                        <th className="border px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingDeliveryNotes ? (
                        <tr>
                          <td colSpan={5} className="border px-4 py-2 text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : deliveryNotes && deliveryNotes.length > 0 ? (
                        deliveryNotes.map((note) => (
                          <tr key={note.id}>
                            <td className="border px-4 py-2">{note.note_number}</td>
                            <td className="border px-4 py-2">
                              {format(new Date(note.date), "dd/MM/yyyy")}
                            </td>
                            <td className="border px-4 py-2">{note.client_name}</td>
                            <td className="border px-4 py-2">{note.total_quantity}</td>
                            <td className="border px-4 py-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="border px-4 py-2 text-center">
                            No delivery notes found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-vouchers">
            <Card>
              <CardHeader>
                <CardTitle>Payment Vouchers</CardTitle>
                <CardDescription>
                  View and manage all payment vouchers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Voucher #</th>
                        <th className="border px-4 py-2 text-left">Date</th>
                        <th className="border px-4 py-2 text-left">Paid To</th>
                        <th className="border px-4 py-2 text-left">Amount</th>
                        <th className="border px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingPaymentVouchers ? (
                        <tr>
                          <td colSpan={5} className="border px-4 py-2 text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : paymentVouchers && paymentVouchers.length > 0 ? (
                        paymentVouchers.map((voucher) => (
                          <tr key={voucher.id}>
                            <td className="border px-4 py-2">{voucher.voucher_number}</td>
                            <td className="border px-4 py-2">
                              {format(new Date(voucher.date), "dd/MM/yyyy")}
                            </td>
                            <td className="border px-4 py-2">{voucher.paid_to}</td>
                            <td className="border px-4 py-2">
                              {new Intl.NumberFormat("en-KE", {
                                style: "currency",
                                currency: "KES",
                              }).format(voucher.total_amount)}
                            </td>
                            <td className="border px-4 py-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="border px-4 py-2 text-center">
                            No payment vouchers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expense-authorizations">
            <Card>
              <CardHeader>
                <CardTitle>Expense Authorizations</CardTitle>
                <CardDescription>
                  View and manage all expense authorizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Auth #</th>
                        <th className="border px-4 py-2 text-left">Date</th>
                        <th className="border px-4 py-2 text-left">Received From</th>
                        <th className="border px-4 py-2 text-left">Amount</th>
                        <th className="border px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingExpenseAuths ? (
                        <tr>
                          <td colSpan={5} className="border px-4 py-2 text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : expenseAuths && expenseAuths.length > 0 ? (
                        expenseAuths.map((auth) => (
                          <tr key={auth.id}>
                            <td className="border px-4 py-2">{auth.authorization_number}</td>
                            <td className="border px-4 py-2">
                              {format(new Date(auth.date), "dd/MM/yyyy")}
                            </td>
                            <td className="border px-4 py-2">{auth.received_from}</td>
                            <td className="border px-4 py-2">
                              {new Intl.NumberFormat("en-KE", {
                                style: "currency",
                                currency: "KES",
                              }).format(auth.sum_of_shillings)}
                            </td>
                            <td className="border px-4 py-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="border px-4 py-2 text-center">
                            No expense authorizations found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts">
            <Card>
              <CardHeader>
                <CardTitle>Receipts</CardTitle>
                <CardDescription>
                  View and manage all receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Receipt #</th>
                        <th className="border px-4 py-2 text-left">Date</th>
                        <th className="border px-4 py-2 text-left">Received From</th>
                        <th className="border px-4 py-2 text-left">Amount</th>
                        <th className="border px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingReceipts ? (
                        <tr>
                          <td colSpan={5} className="border px-4 py-2 text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : receipts && receipts.length > 0 ? (
                        receipts.map((receipt) => (
                          <tr key={receipt.id}>
                            <td className="border px-4 py-2">{receipt.receipt_number}</td>
                            <td className="border px-4 py-2">
                              {format(new Date(receipt.date), "dd/MM/yyyy")}
                            </td>
                            <td className="border px-4 py-2">{receipt.received_from}</td>
                            <td className="border px-4 py-2">
                              {new Intl.NumberFormat("en-KE", {
                                style: "currency",
                                currency: "KES",
                              }).format(receipt.amount)}
                            </td>
                            <td className="border px-4 py-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="border px-4 py-2 text-center">
                            No receipts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
