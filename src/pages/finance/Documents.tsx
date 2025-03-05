
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Printer } from "lucide-react";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { format } from "date-fns";
import { DocumentForm } from "@/components/finance/DocumentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PrintDocument } from "@/components/finance/PrintDocument";

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
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch delivery notes
  const { data: deliveryNotes, isLoading: isLoadingDeliveryNotes, refetch: refetchDeliveryNotes } = useQuery({
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
  const { data: paymentVouchers, isLoading: isLoadingPaymentVouchers, refetch: refetchPaymentVouchers } = useQuery({
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
  const { data: expenseAuths, isLoading: isLoadingExpenseAuths, refetch: refetchExpenseAuths } = useQuery({
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
  const { data: receipts, isLoading: isLoadingReceipts, refetch: refetchReceipts } = useQuery({
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

  const handleDocumentAdded = () => {
    setIsAddDialogOpen(false);
    // Refetch data based on active tab
    switch (activeTab) {
      case "delivery-notes":
        refetchDeliveryNotes();
        break;
      case "payment-vouchers":
        refetchPaymentVouchers();
        break;
      case "expense-authorizations":
        refetchExpenseAuths();
        break;
      case "receipts":
        refetchReceipts();
        break;
    }
  };

  const handleView = (document: any) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FinancialNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Financial Documents</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New {activeTab.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</DialogTitle>
              </DialogHeader>
              <DocumentForm 
                documentType={activeTab as "delivery-notes" | "payment-vouchers" | "expense-authorizations" | "receipts"} 
                onSuccess={handleDocumentAdded} 
              />
            </DialogContent>
          </Dialog>
        </div>

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
                        <th className="border px-4 py-2 text-left">Actions</th>
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
                            <td className="border px-4 py-2 space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleView(note)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                              <PrintDocument documentType="delivery-notes" document={note} />
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
                        <th className="border px-4 py-2 text-left">Actions</th>
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
                            <td className="border px-4 py-2 space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleView(voucher)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                              <PrintDocument documentType="payment-vouchers" document={voucher} />
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
                        <th className="border px-4 py-2 text-left">Actions</th>
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
                            <td className="border px-4 py-2 space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleView(auth)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                              <PrintDocument documentType="expense-authorizations" document={auth} />
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
                        <th className="border px-4 py-2 text-left">Actions</th>
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
                            <td className="border px-4 py-2 space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleView(receipt)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                              <PrintDocument documentType="receipts" document={receipt} />
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

        {/* View Document Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>View Document</DialogTitle>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="p-4">
                <PrintDocument 
                  documentType={activeTab as "delivery-notes" | "payment-vouchers" | "expense-authorizations" | "receipts"} 
                  document={selectedDocument} 
                />
                
                <div className="mt-4 p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Document Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedDocument).map(([key, value]) => {
                      if (key === "id" || key === "created_at") return null;
                      
                      let displayValue = value as string | number;
                      
                      // Format dates
                      if (key === "date" && typeof value === "string") {
                        try {
                          displayValue = format(new Date(value), "PPP");
                        } catch (e) {
                          displayValue = value;
                        }
                      }
                      
                      // Format currency amounts
                      if ((key === "amount" || key === "total_amount" || key === "sum_of_shillings") && typeof value === "number") {
                        displayValue = new Intl.NumberFormat("en-KE", {
                          style: "currency",
                          currency: "KES",
                        }).format(value as number);
                      }
                      
                      const displayKey = key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());
                      
                      return (
                        <div key={key} className="mb-2">
                          <p className="font-medium text-gray-700">{displayKey}:</p>
                          <p>{displayValue?.toString() || "-"}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
