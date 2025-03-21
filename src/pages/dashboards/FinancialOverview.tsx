
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { FinancialNavbar } from '@/components/navigation/FinancialNavbar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Eye, Download, ArrowUpDown } from 'lucide-react';

// Define types
type Transaction = {
  id: string;
  type: string;
  amount: number;
  transaction_date: string;
  description: string;
  reference_number: string;
};

type Receipt = {
  id: string;
  date: string;
  amount: number;
  for_payment: string;
  received_from: string;
  payment_method: string;
  receipt_number: string;
  created_at: string;
  signature: string;
};

const FinancialOverview = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalTreatment: 0,
    totalPurchases: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        
        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('transaction_date', { ascending: false });
        
        if (transactionsError) throw transactionsError;
        
        // Fetch receipts
        const { data: receiptsData, error: receiptsError } = await supabase
          .from('receipts')
          .select('*')
          .order('date', { ascending: false });
        
        if (receiptsError) throw receiptsError;
        
        // Fetch expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });
        
        if (expensesError) throw expensesError;
        
        // Set state
        if (transactionsData) setTransactions(transactionsData);
        if (receiptsData) setReceipts(receiptsData);
        if (expensesData) setExpenses(expensesData);
        
        // Calculate summary values
        if (transactionsData) {
          const sales = transactionsData
            .filter(t => t.type === 'sale')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const treatment = transactionsData
            .filter(t => t.type === 'treatment_income')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const purchases = transactionsData
            .filter(t => t.type === 'purchase')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
            
          const expensesSum = expensesData
            ? expensesData.reduce((sum, e) => sum + (e.amount || 0), 0)
            : 0;
            
          setSummary({
            totalSales: sales,
            totalTreatment: treatment,
            totalPurchases: purchases,
            totalExpenses: expensesSum,
          });
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [toast]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get all transactions formatted for display in the table
  const getAllTransactions = () => {
    const formattedTransactions = transactions.map(t => ({
      id: t.id,
      date: t.transaction_date ? format(new Date(t.transaction_date), 'dd/MM/yyyy') : 'N/A',
      description: t.description || `${t.type} transaction`,
      amount: t.amount,
      type: t.type,
      reference: t.reference_number || 'N/A',
      receipt: false
    }));

    const formattedReceipts = receipts.map(r => ({
      id: r.id,
      date: r.date ? format(new Date(r.date), 'dd/MM/yyyy') : 'N/A',
      description: r.for_payment || `Receipt from ${r.received_from}`,
      amount: r.amount,
      type: 'receipt',
      reference: r.receipt_number || 'N/A',
      receipt: true
    }));

    const formattedExpenses = expenses.map(e => ({
      id: e.id,
      date: e.date ? format(new Date(e.date), 'dd/MM/yyyy') : 'N/A',
      description: e.description || 'Expense transaction',
      amount: e.amount,
      type: 'expense',
      reference: e.reference_number || 'N/A',
      receipt: false
    }));

    let allTransactions = [
      ...formattedTransactions,
      ...formattedReceipts,
      ...formattedExpenses
    ];

    // Apply sorting
    if (sortColumn) {
      allTransactions.sort((a, b) => {
        if (sortColumn === 'amount') {
          return sortDirection === 'asc' 
            ? a.amount - b.amount 
            : b.amount - a.amount;
        } else if (sortColumn === 'date') {
          return sortDirection === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          // For string columns
          const aValue = a[sortColumn as keyof typeof a] as string;
          const bValue = b[sortColumn as keyof typeof b] as string;
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });
    }

    return allTransactions;
  };

  // Filter transactions by type
  const getFilteredTransactions = (type: string) => {
    return getAllTransactions().filter(t => {
      if (type === 'sales') return t.type === 'sale';
      if (type === 'treatment') return t.type === 'treatment_income';
      if (type === 'purchases') return t.type === 'purchase';
      if (type === 'expenses') return t.type === 'expense';
      return true;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <FinancialNavbar />
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Financial Overview</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalSales)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Treatment Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalTreatment)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalPurchases)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Transaction Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          {/* All Transactions Tab */}
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                          Date <ArrowUpDown className="inline h-4 w-4" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('description')} className="cursor-pointer">
                          Description <ArrowUpDown className="inline h-4 w-4" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('amount')} className="cursor-pointer">
                          Amount <ArrowUpDown className="inline h-4 w-4" />
                        </TableHead>
                        <TableHead onClick={() => handleSort('reference')} className="cursor-pointer">
                          Reference <ArrowUpDown className="inline h-4 w-4" />
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getAllTransactions().map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className={transaction.type === 'expense' || transaction.type === 'purchase' ? "text-red-500" : "text-green-500"}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredTransactions('sales').map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-green-500">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Treatment Tab */}
          <TabsContent value="treatment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredTransactions('treatment').map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-green-500">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredTransactions('purchases').map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-red-500">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredTransactions('expenses').map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-red-500">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinancialOverview;
