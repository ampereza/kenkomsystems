
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PreviewDialog } from "./PreviewDialog";

interface Account {
  account_code: string;
  account_name: string;
  account_type: string;
  balance: number;
}

interface FinancialStatementsProps {
  balanceSheet: Account[] | undefined;
  incomeStatement: Account[] | undefined;
  onExportBalanceSheet: () => void;
  onExportIncomeStatement: () => void;
}

export function FinancialStatements({
  balanceSheet,
  incomeStatement,
  onExportBalanceSheet,
  onExportIncomeStatement,
}: FinancialStatementsProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Balance Sheet</CardTitle>
          <PreviewDialog
            title="Balance Sheet Preview"
            data={balanceSheet || []}
            columns={[
              { key: "account_code", label: "Account Code" },
              { key: "account_name", label: "Account Name" },
              { key: "account_type", label: "Type" },
              { key: "balance", label: "Balance" },
            ]}
            onExport={onExportBalanceSheet}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balanceSheet?.map((account, index) => (
                <TableRow key={index}>
                  <TableCell>{account.account_code}</TableCell>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell className="capitalize">{account.account_type}</TableCell>
                  <TableCell className="text-right">
                    ${Number(account.balance).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Income Statement</CardTitle>
          <PreviewDialog
            title="Income Statement Preview"
            data={incomeStatement || []}
            columns={[
              { key: "account_code", label: "Account Code" },
              { key: "account_name", label: "Account Name" },
              { key: "account_type", label: "Type" },
              { key: "balance", label: "Amount" },
            ]}
            onExport={onExportIncomeStatement}
          />
        </CardHeader>
        <CardContent>
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
              {incomeStatement?.map((account, index) => (
                <TableRow key={index}>
                  <TableCell>{account.account_code}</TableCell>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell className="capitalize">{account.account_type}</TableCell>
                  <TableCell className="text-right">
                    ${Number(account.balance).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
