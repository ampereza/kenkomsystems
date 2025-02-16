
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PreviewDialogProps {
  title: string;
  data: any[];
  columns: { key: string; label: string }[];
  onExport: () => void;
}

export function PreviewDialog({ title, data, columns, onExport }: PreviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Preview & Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{title}</DialogTitle>
            <Button onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.key.includes('amount') || column.key.includes('balance')
                      ? `$${Number(row[column.key]).toFixed(2)}`
                      : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
