import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { format } from 'date-fns';
import { DateRangeSelector } from '@/components/reports/DateRangeSelector';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const EmployeeReport = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | null, to: Date | null }>({
    from: null,
    to: null,
  });
  const [selectedRange, setSelectedRange] = useState<string>('today');
  const tableRef = useRef(null);

  const { data: employeeData, isLoading, error } = useQuery({
    queryKey: ['employee-report', dateRange.from, dateRange.to],
    queryFn: async () => {
      let fromDate, toDate;

      switch (selectedRange) {
        case 'today':
          fromDate = startOfDay(new Date());
          toDate = endOfDay(new Date());
          break;
        case 'this_week':
          fromDate = startOfWeek(new Date(), { weekStartsOn: 1 });
          toDate = endOfWeek(new Date(), { weekStartsOn: 1 });
          break;
        case 'this_month':
          fromDate = startOfMonth(new Date());
          toDate = endOfMonth(new Date());
          break;
        case 'this_year':
          fromDate = startOfYear(new Date());
          toDate = endOfYear(new Date());
          break;
        case 'custom':
          if (dateRange.from && dateRange.to) {
            fromDate = startOfDay(dateRange.from);
            toDate = endOfDay(dateRange.to);
          } else {
            return [];
          }
          break;
        default:
          return [];
      }

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .gte('created_at', fromDate.toISOString())
        .lte('created_at', toDate.toISOString());

      if (error) {
        console.error("Error fetching employee data:", error);
        throw error;
      }

      return data || [];
    },
  });

  const handleExport = () => {
    const table = tableRef.current;
    if (!table) {
      console.error("Table ref is not available.");
      return;
    }

    const wb = XLSX.utils.table_to_book(table, { sheet: "Employee Report" });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([new Uint8Array(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, `employee_report_${format(new Date(), 'yyyyMMddHHmmss')}.xlsx`);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <DateRangeSelector
              dateRange={dateRange}
              setDateRange={setDateRange}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
            />
          </div>

          <div className="mb-4">
            <Button onClick={handleExport} disabled={isLoading}>
              {isLoading ? "Loading..." : "Export to Excel"}
            </Button>
          </div>

          {error && <p className="text-red-500">Error: {error.message}</p>}

          <div className="overflow-x-auto">
            <Table ref={tableRef}>
              <TableCaption>A list of your employees.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeData?.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{format(new Date(employee.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeReport;
