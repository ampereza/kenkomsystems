
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
} from "@/components/ui/table";

const EmployeeReport = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date; }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [selectedRange, setSelectedRange] = useState<string>('this_month');
  const tableRef = useRef(null);

  const { data: employeeData, isLoading, error } = useQuery({
    queryKey: ['employee-report', dateRange.from, dateRange.to, selectedRange],
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
          fromDate = startOfDay(dateRange.from);
          toDate = endOfDay(dateRange.to);
          break;
        default:
          fromDate = startOfMonth(new Date());
          toDate = endOfMonth(new Date());
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
    if (!tableRef.current) {
      console.error("Table ref is not available.");
      return;
    }

    // Create a CSV string
    let csvContent = "ID,Name,Email,Position,Created At\n";
    
    employeeData?.forEach(emp => {
      csvContent += `${emp.id},${emp.name},${emp.email},${emp.position},${format(new Date(emp.created_at), 'yyyy-MM-dd')}\n`;
    });
    
    // Create a Blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_report_${format(new Date(), 'yyyyMMddHHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRangeSelect = (range: "day" | "week" | "month" | "year") => {
    switch (range) {
      case "day":
        setSelectedRange("today");
        setDateRange({
          from: startOfDay(new Date()),
          to: endOfDay(new Date())
        });
        break;
      case "week":
        setSelectedRange("this_week");
        setDateRange({
          from: startOfWeek(new Date(), { weekStartsOn: 1 }),
          to: endOfWeek(new Date(), { weekStartsOn: 1 })
        });
        break;
      case "month":
        setSelectedRange("this_month");
        setDateRange({
          from: startOfMonth(new Date()),
          to: endOfMonth(new Date())
        });
        break;
      case "year":
        setSelectedRange("this_year");
        setDateRange({
          from: startOfYear(new Date()),
          to: endOfYear(new Date())
        });
        break;
    }
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
              onRangeSelect={handleRangeSelect}
            />
          </div>

          <div className="mb-4">
            <Button onClick={handleExport} disabled={isLoading}>
              {isLoading ? "Loading..." : "Export to CSV"}
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
                  <TableHead>Position</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeData?.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position}</TableCell>
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
