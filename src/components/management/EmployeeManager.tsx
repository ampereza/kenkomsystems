
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Plus, Trash, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Employee {
  id: string;
  name: string;
  position: string;
  hire_date: string;
  email: string;
  contact_number: string;
  payment_type: "salary" | "daily" | "weekly" | "monthly";
  salary: number;
}

export function EmployeeManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    hire_date: format(new Date(), "yyyy-MM-dd"),
    email: "",
    contact_number: "",
    payment_type: "salary",
    salary: 0,
  });
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    payment_date: format(new Date(), "yyyy-MM-dd"),
    payment_period_start: format(new Date(), "yyyy-MM-dd"),
    payment_period_end: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching employees",
          description: error.message,
        });
        throw error;
      }

      return data || [];
    },
  });

  const addEmployeeMutation = useMutation({
    mutationFn: async (data: Omit<Employee, "id">) => {
      const { data: result, error } = await supabase
        .from("employees")
        .insert(data)
        .select();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setShowAddDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add employee: ${error.message}`,
      });
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Employee> }) => {
      const { data: result, error } = await supabase
        .from("employees")
        .update(data)
        .eq("id", id)
        .select();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setShowEditDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update employee: ${error.message}`,
      });
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employees").delete().eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setShowDeleteAlert(false);
      setCurrentEmployee(null);
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete employee: ${error.message}`,
      });
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (data: {
      employee_id: string;
      amount: number;
      payment_date: string;
      payment_period_start: string;
      payment_period_end: string;
    }) => {
      const { data: result, error } = await supabase
        .from("salary_payments")
        .insert(data)
        .select();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-payments"] });
      setShowPaymentDialog(false);
      setPaymentData({
        amount: 0,
        payment_date: format(new Date(), "yyyy-MM-dd"),
        payment_period_start: format(new Date(), "yyyy-MM-dd"),
        payment_period_end: format(new Date(), "yyyy-MM-dd"),
      });
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to record payment: ${error.message}`,
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      hire_date: format(new Date(), "yyyy-MM-dd"),
      email: "",
      contact_number: "",
      payment_type: "salary",
      salary: 0,
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployeeMutation.mutate({
      name: formData.name,
      position: formData.position,
      hire_date: formData.hire_date,
      email: formData.email,
      contact_number: formData.contact_number,
      payment_type: formData.payment_type as "salary" | "daily" | "weekly" | "monthly",
      salary: Number(formData.salary),
    });
  };

  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;

    updateEmployeeMutation.mutate({
      id: currentEmployee.id,
      data: {
        name: formData.name,
        position: formData.position,
        hire_date: formData.hire_date,
        email: formData.email,
        contact_number: formData.contact_number,
        payment_type: formData.payment_type as "salary" | "daily" | "weekly" | "monthly",
        salary: Number(formData.salary),
      },
    });
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;

    addPaymentMutation.mutate({
      employee_id: currentEmployee.id,
      amount: paymentData.amount,
      payment_date: paymentData.payment_date,
      payment_period_start: paymentData.payment_period_start,
      payment_period_end: paymentData.payment_period_end,
    });
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      position: employee.position,
      hire_date: employee.hire_date.split("T")[0], // Format date for input
      email: employee.email || "",
      contact_number: employee.contact_number || "",
      payment_type: employee.payment_type || "salary",
      salary: employee.salary || 0,
    });
    setShowEditDialog(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setShowDeleteAlert(true);
  };

  const handlePayEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setPaymentData({
      amount: employee.salary || 0,
      payment_date: format(new Date(), "yyyy-MM-dd"),
      payment_period_start: format(new Date(), "yyyy-MM-dd"),
      payment_period_end: format(new Date(), "yyyy-MM-dd"),
    });
    setShowPaymentDialog(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Employees</CardTitle>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input
                  id="hire_date"
                  name="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_type">Payment Type</Label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value) => handleSelectChange(value, "payment_type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary/Rate</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Add Employee</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading employees...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Salary/Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees && employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        {new Date(employee.hire_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          {employee.email && <div>{employee.email}</div>}
                          {employee.contact_number && <div>{employee.contact_number}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {employee.payment_type || "Salary"}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-UG", {
                          style: "currency",
                          currency: "UGX",
                          maximumFractionDigits: 0,
                        }).format(employee.salary || 0)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePayEmployee(employee)}
                            className="text-green-600"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEmployee(employee)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No employees found. Add your first employee to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateEmployee} className="space-y-4">
            {/* Same form fields as add employee, just different submit handler */}
            <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hire_date">Hire Date</Label>
                <Input
                  id="edit-hire_date"
                  name="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact_number">Contact Number</Label>
                <Input
                  id="edit-contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-payment_type">Payment Type</Label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value) => handleSelectChange(value, "payment_type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary/Rate</Label>
                <Input
                  id="edit-salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleFormChange}
                  required
                />
              </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Update Employee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Record Payment for {currentEmployee?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={paymentData.amount}
                onChange={handlePaymentFormChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date</Label>
              <Input
                id="payment_date"
                name="payment_date"
                type="date"
                value={paymentData.payment_date}
                onChange={handlePaymentFormChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_period_start">Period Start</Label>
              <Input
                id="payment_period_start"
                name="payment_period_start"
                type="date"
                value={paymentData.payment_period_start}
                onChange={handlePaymentFormChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_period_end">Period End</Label>
              <Input
                id="payment_period_end"
                name="payment_period_end"
                type="date"
                value={paymentData.payment_period_end}
                onChange={handlePaymentFormChange}
                required
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-bold">{currentEmployee?.name}</span> and
              associated records from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentEmployee && deleteEmployeeMutation.mutate(currentEmployee.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
