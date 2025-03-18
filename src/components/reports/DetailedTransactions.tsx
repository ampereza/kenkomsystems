import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeProps } from './DateRangeSelector';

export interface DetailedTransactionsProps extends DateRangeProps {
  limit?: number;
}

export const DetailedTransactions: React.FC<DetailedTransactionsProps> = ({ 
  from, 
  to, 
  limit = 5 
}) => {
  // Dummy data - in a real app, this would be fetched from the API
  const transactions = [
    { 
      id: '1', 
      date: '2023-06-01', 
      description: 'Supplier Payment', 
      amount: -2500, 
      type: 'expense' 
    },
    { 
      id: '2', 
      date: '2023-06-02', 
      description: 'Customer Invoice #1001', 
      amount: 5000, 
      type: 'income' 
    },
    { 
      id: '3', 
      date: '2023-06-03', 
      description: 'Office Supplies', 
      amount: -350, 
      type: 'expense' 
    },
    { 
      id: '4', 
      date: '2023-06-04', 
      description: 'Customer Invoice #1002', 
      amount: 7500, 
      type: 'income' 
    },
    { 
      id: '5', 
      date: '2023-06-05', 
      description: 'Employee Salaries', 
      amount: -4500, 
      type: 'expense' 
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, limit).map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-muted/50">
                  <td className="py-2">{transaction.date}</td>
                  <td className="py-2">{transaction.description}</td>
                  <td className={`py-2 text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedTransactions;
