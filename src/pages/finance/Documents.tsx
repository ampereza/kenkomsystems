
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DeliveryNotesTable } from "@/components/finance/documents/DeliveryNotesTable";
import { PaymentVouchersTable } from "@/components/finance/documents/PaymentVouchersTable";
import { ExpenseAuthorizationsTable } from "@/components/finance/documents/ExpenseAuthorizationsTable";
import { ReceiptsTable } from "@/components/finance/documents/ReceiptsTable";
import { ViewDocumentDialog } from "@/components/finance/documents/ViewDocumentDialog";
import { AddDocumentDialog } from "@/components/finance/documents/AddDocumentDialog";

// Types for our documents
type DocumentType = "delivery-notes" | "payment-vouchers" | "expense-authorizations" | "receipts";

export default function Documents() {
  const [activeTab, setActiveTab] = useState<DocumentType>("delivery-notes");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleDocumentAdded = () => {
    setIsAddDialogOpen(false);
  };

  const handleViewDocument = (document: any) => {
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
            <AddDocumentDialog 
              documentType={activeTab} 
              onSuccess={handleDocumentAdded} 
            />
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DocumentType)} className="w-full">
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
                <DeliveryNotesTable onViewDocument={handleViewDocument} />
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
                <PaymentVouchersTable onViewDocument={handleViewDocument} />
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
                <ExpenseAuthorizationsTable onViewDocument={handleViewDocument} />
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
                <ReceiptsTable onViewDocument={handleViewDocument} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Document Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <ViewDocumentDialog 
            documentType={activeTab} 
            document={selectedDocument} 
          />
        </Dialog>
      </div>
    </div>
  );
}
