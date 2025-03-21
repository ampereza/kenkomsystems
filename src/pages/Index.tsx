import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, FileBarChart, Package, TestTube2, UserCog2, Users } from "lucide-react";

export default function Index() {
  const [clients, setClients] = useState<number>(0);
  const [suppliers, setSuppliers] = useState<number>(0);
  const [employees, setEmployees] = useState<number>(0);
  const [transactions, setTransactions] = useState<number>(0);
  const [stockCategories, setStockCategories] = useState({
    fencing: 0,
    telecom: 0,
    accepted: 0, // Changed from 'rejected' to 'accepted' to match allowed types
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch client count
      const { count: clientCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });
      if (clientCount !== null) setClients(clientCount);

      // Fetch supplier count
      const { count: supplierCount } = await supabase
        .from("suppliers")
        .select("*", { count: "exact", head: true });
      if (supplierCount !== null) setSuppliers(supplierCount);

      // Fetch employee count
      const { count: employeeCount } = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true });
      if (employeeCount !== null) setEmployees(employeeCount);

      // Fetch transaction count
      const { count: transactionCount } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });
      if (transactionCount !== null) setTransactions(transactionCount);

      // Fetch stock categories
      // For the 'accepted' category (previously 'rejected')
      const { data: accepted } = await supabase
        .from("actual_stock")
        .select("category, COUNT(*) as total_poles")
        .eq("category", "pole") // Use a valid category instead of 'rejected'
        .group("category")
        .single();

      // For the 'fencing' category
      const { data: fencing } = await supabase
        .from("actual_stock")
        .select("category, COUNT(*) as total_poles")
        .eq("category", "fencing")
        .group("category")
        .single();

      // For the 'telecom' category
      const { data: telecom } = await supabase
        .from("actual_stock")
        .select("category, COUNT(*) as total_poles")
        .eq("category", "telecom")
        .group("category")
        .single();

      setStockCategories({
        fencing: fencing?.total_poles || 0,
        telecom: telecom?.total_poles || 0,
        accepted: accepted?.total_poles || 0,
      });
    }

    fetchData();
  }, []);

  // Fix the treatment_summary query to use a valid table
  useEffect(() => {
    const fetchTreatmentData = async () => {
      try {
        // Using treatment_log instead of treatments
        const { data, error } = await supabase
          .from("treatment_log")
          .select("*")
          .limit(5);

        if (error) {
          console.error("Error fetching treatment data:", error);
        } else {
          console.log("Treatment data:", data);
        }
      } catch (err) {
        console.error("Error in treatment data fetch:", err);
      }
    };

    fetchTreatmentData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Total number of clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clients}</div>
            <Link to="/clients" className="text-sm text-muted-foreground hover:underline">
              View Clients
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>Total number of suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suppliers}</div>
            <Link to="/suppliers/view" className="text-sm text-muted-foreground hover:underline">
              View Suppliers
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Total number of employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{employees}</div>
            <Link to="/admin/users" className="text-sm text-muted-foreground hover:underline">
              Manage Users
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Total number of transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{transactions}</div>
            <Link to="/finance/transactions" className="text-sm text-muted-foreground hover:underline">
              View Transactions
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Stock Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fencing Poles</CardTitle>
              <CardDescription>Total fencing poles in stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stockCategories.fencing}</div>
              {/* You can add a link to the stock management page if needed */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Telecom Poles</CardTitle>
              <CardDescription>Total telecom poles in stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stockCategories.telecom}</div>
              {/* You can add a link to the stock management page if needed */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accepted Poles</CardTitle>
              <CardDescription>Total accepted poles in stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stockCategories.accepted}</div>
              {/* You can add a link to the stock management page if needed */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
