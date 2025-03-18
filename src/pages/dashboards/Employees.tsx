
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export default function Employees() {
  const { toast } = useToast();

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

      return data;
    },
  });

  return (
    <div>
      
      <main className="container py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Employees</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading employees...</div>
        ) : employees && employees.length > 0 ? (
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Position</th>
                  <th className="text-left p-4">Contact Number</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Hire Date</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-t">
                    <td className="p-4">{employee.name}</td>
                    <td className="p-4">{employee.position}</td>
                    <td className="p-4">{employee.contact_number}</td>
                    <td className="p-4">{employee.email}</td>
                    <td className="p-4">
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No employees found
          </div>
        )}
      </main>
    </div>
  );
}
