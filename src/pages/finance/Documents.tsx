
import { useState } from "react";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Plus, File, FileSpreadsheet, Receipt, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

export default function Documents() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("delivery-notes");

  // Fetch delivery notes
  const { data: deliveryNotes, isLoading: loadingDeliveryNotes } = useQuery({
    queryKey: ["delivery-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_notes")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching delivery notes",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
  });

  // Fetch payment vouchers
  const { data: paymentVouchers, isLoading: loadingPaymentVouchers } = useQuery({
    queryKey: ["payment-vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_vouchers")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching payment vouchers",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
  });

  // Fetch expense authorizations
  const { data: expenseAuths, isLoading: loadingExpenseAuths } = useQuery({
    queryKey: ["expense-authorizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expense_authorizations")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching expense authorizations",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
  });

  // Fetch receipts
  const { data: receipts, isLoading: loadingReceipts } = useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching receipts",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
  });

  return (
    <div>
      <FinancialNavbar />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Financial Documents</h1>
        </div>

        <Tabs defaultValue="delivery-notes" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="delivery-notes" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Delivery Notes
            </TabsTrigger>
            <TabsTrigger value="payment-vouchers" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Payment Vouchers
            </TabsTrigger>
            <TabsTrigger value="expense-authorizations" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Expense Authorizations
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Receipts
            </TabsTrigger>
          </TabsList>

          {/* Delivery Notes Tab */}
          <TabsContent value="delivery-notes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Delivery Notes</CardTitle>
                  <CardDescription>
                    Manage delivery notes for client stock deliveries
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Delivery Note
                </Button>
              </CardHeader>
              <CardContent>
                {loadingDeliveryNotes ? (
                  <div className="text-center py-8">Loading delivery notes...</div>
                ) : deliveryNotes && deliveryNotes.length > 0 ? (
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4">Note #</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Client</th>
                          <th className="text-left p-4">Batch #</th>
                          <th className="text-left p-4">Quantity</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryNotes.map((note) => (
                          <tr key={note.id} className="border-t">
                            <td className="p-4">{note.note_number}</td>
                            <td className="p-4">
                              {new Date(note.date).toLocaleDateString()}
                            </td>
                            <td className="p-4">{note.client_name}</td>
                            <td className="p-4">{note.batch_number}</td>
                            <td className="p-4">{note.total_quantity}</td>
                            <td className="p-4">
                              <Link to={`/finance/documents/delivery-notes/${note.id}`}>
                                <Button variant="outline" size="sm">
                                  <File className="mr-2 h-4 w-4" /> View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No delivery notes found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Vouchers Tab */}
          <TabsContent value="payment-vouchers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment Vouchers</CardTitle>
                  <CardDescription>
                    Manage payment vouchers for expenses and payroll
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Payment Voucher
                </Button>
              </CardHeader>
              <CardContent>
                {loadingPaymentVouchers ? (
                  <div className="text-center py-8">Loading payment vouchers...</div>
                ) : paymentVouchers && paymentVouchers.length > 0 ? (
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4">Voucher #</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Paid To</th>
                          <th className="text-left p-4">Amount</th>
                          <th className="text-left p-4">Approved By</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentVouchers.map((voucher) => (
                          <tr key={voucher.id} className="border-t">
                            <td className="p-4">{voucher.voucher_number}</td>
                            <td className="p-4">
                              {new Date(voucher.date).toLocaleDateString()}
                            </td>
                            <td className="p-4">{voucher.paid_to}</td>
                            <td className="p-4">${Number(voucher.total_amount).toFixed(2)}</td>
                            <td className="p-4">{voucher.payment_approved_by}</td>
                            <td className="p-4">
                              <Link to={`/finance/documents/payment-vouchers/${voucher.id}`}>
                                <Button variant="outline" size="sm">
                                  <File className="mr-2 h-4 w-4" /> View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment vouchers found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expense Authorizations Tab */}
          <TabsContent value="expense-authorizations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Expense Authorizations</CardTitle>
                  <CardDescription>
                    Manage expense authorizations for company expenditures
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Expense Authorization
                </Button>
              </CardHeader>
              <CardContent>
                {loadingExpenseAuths ? (
                  <div className="text-center py-8">Loading expense authorizations...</div>
                ) : expenseAuths && expenseAuths.length > 0 ? (
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4">Auth #</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Received From</th>
                          <th className="text-left p-4">Amount</th>
                          <th className="text-left p-4">Purpose</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseAuths.map((auth) => (
                          <tr key={auth.id} className="border-t">
                            <td className="p-4">{auth.authorization_number}</td>
                            <td className="p-4">
                              {new Date(auth.date).toLocaleDateString()}
                            </td>
                            <td className="p-4">{auth.received_from}</td>
                            <td className="p-4">${Number(auth.sum_of_shillings).toFixed(2)}</td>
                            <td className="p-4">{auth.being_payment_of}</td>
                            <td className="p-4">
                              <Link to={`/finance/documents/expense-authorizations/${auth.id}`}>
                                <Button variant="outline" size="sm">
                                  <File className="mr-2 h-4 w-4" /> View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No expense authorizations found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipts Tab */}
          <TabsContent value="receipts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Receipts</CardTitle>
                  <CardDescription>
                    Manage receipts for payments received
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Receipt
                </Button>
              </CardHeader>
              <CardContent>
                {loadingReceipts ? (
                  <div className="text-center py-8">Loading receipts...</div>
                ) : receipts && receipts.length > 0 ? (
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4">Receipt #</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Received From</th>
                          <th className="text-left p-4">Amount</th>
                          <th className="text-left p-4">For Payment</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receipts.map((receipt) => (
                          <tr key={receipt.id} className="border-t">
                            <td className="p-4">{receipt.receipt_number}</td>
                            <td className="p-4">
                              {new Date(receipt.date).toLocaleDateString()}
                            </td>
                            <td className="p-4">{receipt.received_from}</td>
                            <td className="p-4">${Number(receipt.amount).toFixed(2)}</td>
                            <td className="p-4">{receipt.for_payment}</td>
                            <td className="p-4">
                              <Link to={`/finance/documents/receipts/${receipt.id}`}>
                                <Button variant="outline" size="sm">
                                  <File className="mr-2 h-4 w-4" /> View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No receipts found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
