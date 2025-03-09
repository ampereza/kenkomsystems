
import * as React from "react";
import { BaseIncomeStatement } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/components/finance/print-templates/BasePrintTemplate";

interface SummaryViewProps {
  data: BaseIncomeStatement[];
  calculateNetIncome: (data: BaseIncomeStatement[]) => number;
}

export function SummaryView({ data, calculateNetIncome }: SummaryViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="capitalize">{item.account_type}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(Number(item.total_amount))}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell>Net Income</TableCell>
          <TableCell className="text-right">
            {formatCurrency(calculateNetIncome(data || []))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
