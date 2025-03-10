import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangeSelector } from '@/components/reports/DateRangeSelector';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { format } from 'date-fns';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from '@david.kramer/react-pdf-table';
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit, Copy, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/components/auth/AuthProvider"

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  viewer: {
    width: "100%",
    height: "90vh",
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    margin: 4,
    fontSize: 12,
    fontWeight: "bold"
  },
  tableCell: {
    margin: 5,
    fontSize: 10
  }
});

const SupplierReport = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<any>(null);
  const [editedSupplierName, setEditedSupplierName] = useState('');
  const [editedSupplierContact, setEditedSupplierContact] = useState('');
  const [editedSupplierEmail, setEditedSupplierEmail] = useState('');
  const [editedSupplierAddress, setEditedSupplierAddress] = useState('');
  const { toast } = useToast()
  const { user } = useUser();
  const isAdmin = user?.user_role === 'admin';

  const { data: suppliers, refetch } = useQuery({
    queryKey: ['suppliers', dateRange.from, dateRange.to],
    queryFn: async () => {
      if (!dateRange.from || !dateRange.to) {
        return [];
      }

      const from = startOfDay(dateRange.from).toISOString();
      const to = endOfDay(dateRange.to).toISOString();

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .gte('created_at', from)
        .lte('created_at', to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
      }

      return data;
    },
  });

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    setDateRange(range);
  };

  const handleDeleteConfirmation = (supplier: any) => {
    setSupplierToDelete(supplier);
    setIsDialogOpen(true);
  };

  const handleEdit = (supplier: any) => {
    setSupplierToEdit(supplier);
    setEditedSupplierName(supplier.supplier_name);
    setEditedSupplierContact(supplier.contact_number);
    setEditedSupplierEmail(supplier.email);
    setEditedSupplierAddress(supplier.address);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (supplierToDelete) {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierToDelete.id);

      if (error) {
        console.error("Error deleting supplier:", error);
        toast({
          title: "Error deleting supplier",
          description: "Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Supplier deleted",
          description: "Supplier has been successfully deleted.",
        })
        refetch();
      }
      setIsDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  const updateSupplier = async () => {
    if (supplierToEdit) {
      const { error } = await supabase
        .from('suppliers')
        .update({
          supplier_name: editedSupplierName,
          contact_number: editedSupplierContact,
          email: editedSupplierEmail,
          address: editedSupplierAddress,
        })
        .eq('id', supplierToEdit.id);

      if (error) {
        console.error("Error updating supplier:", error);
        toast({
          title: "Error updating supplier",
          description: "Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Supplier updated",
          description: "Supplier has been successfully updated.",
        })
        refetch();
      }
      setIsEditDialogOpen(false);
      setSupplierToEdit(null);
    }
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Supplier Report</Text>
          {dateRange.from && dateRange.to && (
            <Text style={{ textAlign: 'center', marginBottom: 10 }}>
              {`From: ${format(dateRange.from, 'PPP')} To: ${format(dateRange.to, 'PPP')}`}
            </Text>
          )}
          <Table data={suppliers || []}>
            <TableHeader>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Created At</TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell getContent={(r) => r.supplier_name} />
              <DataTableCell getContent={(r) => r.contact_number} />
              <DataTableCell getContent={(r) => r.email} />
              <DataTableCell getContent={(r) => r.address} />
              <DataTableCell getContent={(r) => format(new Date(r.created_at), 'PPP')} />
            </TableBody>
          </Table>
        </View>
      </Page>
    </Document>
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Supplier Report</CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
          <div className="mt-4">
            {suppliers && suppliers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                        {isAdmin && (
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {suppliers.map((supplier) => (
                        <tr key={supplier.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.supplier_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.contact_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.address}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(supplier.created_at), 'PPP')}</td>
                          {isAdmin && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDeleteConfirmation(supplier)}>
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PDFDownloadLink document={<MyDocument />} fileName="supplier_report.pdf">
                  {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : <Button className="mt-4">Download PDF</Button>
                  }
                </PDFDownloadLink>
              </>
            ) : (
              <div className="text-gray-500">No suppliers found for the selected date range.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete <Badge variant="secondary">{supplierToDelete?.supplier_name}</Badge> ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Make changes to the supplier details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogContent>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={editedSupplierName} onChange={(e) => setEditedSupplierName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact
                </Label>
                <Input id="contact" value={editedSupplierContact} onChange={(e) => setEditedSupplierContact(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" value={editedSupplierEmail} onChange={(e) => setEditedSupplierEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input id="address" value={editedSupplierAddress} onChange={(e) => setEditedSupplierAddress(e.target.value)} className="col-span-3" />
              </div>
            </div>
          </AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={updateSupplier}>Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupplierReport;
