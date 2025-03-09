
import * as React from "react";
import { DetailedIncomeStatement } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DetailedViewProps {
  data: DetailedIncomeStatement[];
  calculateNetIncome: (data: DetailedIncomeStatement[]) => number;
}

export function DetailedView({ data, calculateNetIncome }: DetailedViewProps) {
  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{new Date(item.entry_date).toLocaleDateString()}</TableCell>
            <TableCell>{item.reference_number}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.account_name}</TableCell>
            <TableCell className="capitalize">{item.account_type}</TableCell>
            <TableCell className="text-right">
              {formatUGX(Number(item.amount))}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell colSpan={5}>Net Income</TableCell>
          <TableCell className="text-right">
            {formatUGX(calculateNetIncome(data || []))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
