
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  date: string;
  type: string;
  transaction_count: number;
  total_amount: number;
}

interface DetailedTransactionsProps {
  transactions: Transaction[] | undefined;
}

export function DetailedTransactions({ transactions }: DetailedTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Transaction Count</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>{item.transaction_count}</TableCell>
                <TableCell>${Number(item.total_amount).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
