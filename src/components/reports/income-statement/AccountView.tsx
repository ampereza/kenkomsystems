
import * as React from "react";
import { AccountIncomeStatement } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AccountViewProps {
  data: AccountIncomeStatement[];
  calculateNetIncome: (data: AccountIncomeStatement[]) => number;
}

export function AccountView({ data, calculateNetIncome }: AccountViewProps) {
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
          <TableHead>Account Code</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.account_code}</TableCell>
            <TableCell>{item.account_name}</TableCell>
            <TableCell className="capitalize">{item.account_type}</TableCell>
            <TableCell className="text-right">
              {formatUGX(Number(item.total_amount))}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell colSpan={3}>Net Income</TableCell>
          <TableCell className="text-right">
            {formatUGX(calculateNetIncome(data || []))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
