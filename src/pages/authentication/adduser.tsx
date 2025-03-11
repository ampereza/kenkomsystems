
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type UserRole = "admin" | "managing_director" | "general_manager" | "production_manager" | "stock_manager" | "accountant" | "user";

const AddUser: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (existingUser) {
        throw new Error("A user with this email already exists");
      }

      // Insert new user
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          { 
            email, 
            password, 
            name, 
            user_role: userRole
          }
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess("User added successfully!");
      
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setUserRole("user");
      
      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication
  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    
    if (isAuthenticated !== "true") {
      navigate("/login");
    } else if (userRole !== "admin" && userRole !== "managing_director") {
      navigate("/unauthorized");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-1 bg-slate-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Link to="/dashboard" className="text-slate-500 hover:text-slate-700 transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <CardTitle className="text-2xl font-bold">Add User</CardTitle>
            </div>
            <CardDescription>
              Create a new user account with specific role
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userRole">User Role</Label>
                <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Management</SelectLabel>
                      <SelectItem value="managing_director">Managing Director</SelectItem>
                      <SelectItem value="general_manager">General Manager</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Department Roles</SelectLabel>
                      <SelectItem value="production_manager">Production Manager</SelectItem>
                      <SelectItem value="stock_manager">Stock Manager</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>System Roles</SelectLabel>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">Regular User</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-green-50 border-green-500 text-green-700 animate-fade-in">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="pt-2">
                <Alert className="bg-blue-50 border-blue-500 text-blue-700">
                  <AlertDescription>
                    This user will be added to the system and will have permissions based on their assigned role.
                  </AlertDescription>
                </Alert>
              </div>
              
              <Button 
                type="submit" 
                className="w-full gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding User...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Add User
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddUser;
