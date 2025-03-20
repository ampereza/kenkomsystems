import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee, PaymentType } from "@/types/Employee";

export function EmployeeManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Employee, "id" | "created_at">>({
    name: "",
    position: "",
    email: "",
    contact_number: "",
    hire_date: new Date().toISOString().split("T")[0],
    payment_type: "salary" as PaymentType, // Cast to PaymentType
    salary: 0,
  });
  
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  
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
          title: "Error fetching employee data",
          description: JSON.stringify(error),
        });
        throw error;
      }
      
      return data as Employee[];
    },
  });
  
  const addEmployeeMutation = useMutation({
    mutationFn: async (values: Omit<Employee, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("employees")
        .insert([{
          name: values.name,
          position: values.position,
          email: values.email,
          contact_number: values.contact_number,
          hire_date: values.hire_date,
          payment_type: values.payment_type,
          salary: values.salary,
        }])
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Employee added",
        description: "The employee has been added successfully",
      });
      setIsAddOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error adding employee",
        description: error.message,
      });
    },
  });
  
  const updateEmployeeMutation = useMutation({
    mutationFn: async (values: Employee) => {
      const { data, error } = await supabase
        .from("employees")
        .update({
          name: values.name,
          position: values.position,
          email: values.email,
          contact_number: values.contact_number,
          hire_date: values.hire_date,
          payment_type: values.payment_type,
          salary: values.salary,
        })
        .eq("id", values.id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Employee updated",
        description: "The employee has been updated successfully",
      });
      setIsEditOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating employee",
        description: error.message,
      });
    },
  });
  
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Employee deleted",
        description: "The employee has been removed",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting employee",
        description: error.message,
      });
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "salary" ? parseFloat(value) : value,
    });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      payment_type: value as PaymentType, // Cast to PaymentType
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployeeMutation.mutate(formData);
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      email: "",
      contact_number: "",
      hire_date: new Date().toISOString().split("T")[0],
      payment_type: "salary" as PaymentType,
      salary: 0,
    });
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployeeMutation.mutate(id);
    }
  };
  
  const handleEdit = (employee: Employee) => {
    setEditEmployeeId(employee.id);
    setFormData({
      name: employee.name,
      position: employee.position,
      email: employee.email,
      contact_number: employee.contact_number,
      hire_date: employee.hire_date,
      payment_type: employee.payment_type as PaymentType, // Cast to PaymentType
      salary: employee.salary,
    });
    setIsEditOpen(true);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEmployeeId) {
      updateEmployeeMutation.mutate({
        id: editEmployeeId,
        ...formData,
        created_at: new Date().toISOString(),
      } as Employee);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Management</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Add Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position" 
                    name="position" 
                    value={formData.position} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input 
                    id="contact_number" 
                    name="contact_number" 
                    value={formData.contact_number} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="hire_date">Hire Date</Label>
                  <Input 
                    id="hire_date" 
                    name="hire_date" 
                    type="date" 
                    value={formData.hire_date} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="payment_type">Payment Type</Label>
                  <Select 
                    onValueChange={handleSelectChange}
                    defaultValue={formData.payment_type}
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
                
                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input 
                    id="salary" 
                    name="salary" 
                    type="number" 
                    value={formData.salary.toString()} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Add Employee</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.contact_number}</TableCell>
                <TableCell className="capitalize">{employee.payment_type}</TableCell>
                <TableCell>${employee.salary.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(employee)}>
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_name">Name</Label>
                  <Input 
                    id="edit_name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_position">Position</Label>
                  <Input 
                    id="edit_position" 
                    name="position" 
                    value={formData.position} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_email">Email</Label>
                  <Input 
                    id="edit_email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_contact_number">Contact Number</Label>
                  <Input 
                    id="edit_contact_number" 
                    name="contact_number" 
                    value={formData.contact_number} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_hire_date">Hire Date</Label>
                  <Input 
                    id="edit_hire_date" 
                    name="hire_date" 
                    type="date" 
                    value={formData.hire_date} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_payment_type">Payment Type</Label>
                  <Select 
                    onValueChange={handleSelectChange}
                    defaultValue={formData.payment_type}
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
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_salary">Salary</Label>
                  <Input 
                    id="edit_salary" 
                    name="salary" 
                    type="number" 
                    value={formData.salary.toString()} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Update Employee</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
