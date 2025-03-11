
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangeSelector } from '@/components/reports/DateRangeSelector';
import { startOfDay, endOfDay } from 'date-fns';
import { format } from 'date-fns';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
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
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the user interface based on the AuthProvider implementation
interface User {
  id: string;
  email: string;
  name: string;
  user_role: string;
}

// Custom hook to get the current user
const useUser = () => {
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');
  
  const user: User | null = userRole && userName && userId ? {
    id: userId,
    email: '', // not available from localStorage
    name: userName,
    user_role: userRole
  } : null;
  
  return { user };
};

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
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#bff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bff',
    alignItems: 'center',
    minHeight: 24,
    width: '100%',
  },
  tableHeaderRow: {
    backgroundColor: '#f6f6f6',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bff',
    alignItems: 'center',
    height: 30,
    width: '100%',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '20%',
    borderRightWidth: 1,
    borderColor: '#bff',
    padding: 4,
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
    setEditedSupplierName(supplier.name);
    setEditedSupplierContact(supplier.phone);
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
          name: editedSupplierName,
          phone: editedSupplierContact,
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

  // Custom PDF document component
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
          
          {/* Custom table implementation without the external package */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.tableCol}>
                <Text>Name</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Contact</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Email</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Address</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Created At</Text>
              </View>
            </View>
            
            {/* Table Body */}
            {suppliers && suppliers.map((supplier, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text>{supplier.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{supplier.phone}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{supplier.email}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{supplier.address}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{format(new Date(supplier.created_at), 'PPP')}</Text>
                </View>
              </View>
            ))}
          </View>
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
          <DateRangeSelector 
            dateRange={dateRange} 
            setDateRange={setDateRange} 
          />
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.phone}</td>
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
              This action cannot be undone. Are you sure you want to delete <Badge variant="secondary">{supplierToDelete?.name}</Badge> ?
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
