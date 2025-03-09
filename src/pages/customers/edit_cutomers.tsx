
import { useState, useEffect } from "react";
import { FinancialNavbar } from "@/components/navigation/FinancialNavbar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Customer {
  id: number;
  full_name: string;
  company_name?: string;
  telepnone?: string;
  address?: string;
  created_at: string;
}

export default function EditCustomer() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [customerData, setCustomerData] = useState<Customer>({
    id: 0,
    full_name: "",
    company_name: "",
    telepnone: "",
    address: "",
    created_at: "",
  });

  // Extract customer ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get("id");

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No customer ID provided",
        });
        navigate("/customers/customers");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", parseInt(customerId, 10))
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Customer not found",
          });
          navigate("/customers/customers");
          return;
        }

        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load customer data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("customers")
        .update({
          full_name: customerData.full_name,
          company_name: customerData.company_name,
          telepnone: customerData.telepnone,
          address: customerData.address,
        })
        .eq("id", parseInt(customerId!, 10));

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer updated successfully",
      });

      navigate("/customers/customers");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <FinancialNavbar />
        <main className="container py-6 flex-1 flex items-center justify-center">
          <p>Loading customer data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <FinancialNavbar />
      <main className="container py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Customer</h1>
          <p className="text-muted-foreground">Update customer information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input 
                    id="full_name" 
                    name="full_name" 
                    value={customerData.full_name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input 
                    id="company_name" 
                    name="company_name" 
                    value={customerData.company_name || ""} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telepnone">Phone</Label>
                  <Input 
                    id="telepnone" 
                    name="telepnone" 
                    value={customerData.telepnone || ""} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    name="address" 
                    value={customerData.address || ""} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customers/customers")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Update Customer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
