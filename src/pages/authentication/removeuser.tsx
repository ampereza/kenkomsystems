
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Trash2, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserRole } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  name?: string;
  user_role: UserRole;
}

const RemoveUser: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated with admin role
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      // Check user role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      
      if (profileError || !profileData) {
        navigate("/login");
        return;
      }
      
      if (profileData.role !== "managing_director" && profileData.role !== "general_manager") {
        navigate("/unauthorized");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSearch = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setIsSearching(true);
    setError(null);
    setFoundUser(null);
    setConfirmDelete(false);

    try {
      // Search for the user in the profiles table
      const { data: user, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !user) {
        setError("User not found with the provided email");
        return;
      }

      setFoundUser({
        id: user.id,
        email: user.email || "",
        name: user.full_name,
        user_role: user.role as UserRole
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemove = async () => {
    if (!foundUser) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Call the Supabase Admin API to delete the user
      // This will cascade delete the profile due to RLS
      const { error } = await supabase.auth.admin.deleteUser(
        foundUser.id
      );

      if (error) {
        throw new Error("Failed to remove user: " + error.message);
      }

      setSuccess(`User ${foundUser.email} removed successfully.`);
      setEmail("");
      setFoundUser(null);
      setConfirmDelete(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <CardTitle className="text-2xl font-bold">Remove User</CardTitle>
            </div>
            <CardDescription>
              Search and remove a user from the system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user.to.remove@example.com"
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="outline"
                className="w-full gap-2"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Search User
                  </>
                )}
              </Button>
            </form>
            
            {error && (
              <Alert variant="destructive" className="mt-4 animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mt-4 bg-green-50 border-green-500 text-green-700 animate-fade-in">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            {foundUser && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 space-y-4 border rounded-lg p-4 bg-slate-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary rounded-full p-2 text-white">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{foundUser.name || foundUser.email}</h3>
                    <p className="text-sm text-slate-500">{foundUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-slate-200 rounded-full">
                      {foundUser.user_role}
                    </span>
                  </div>
                </div>
                
                {!confirmDelete ? (
                  <Button 
                    type="button" 
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 size={18} />
                    Remove User
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Alert variant="destructive" className="animate-fade-in">
                      <AlertDescription>
                        Are you sure? This action cannot be undone.
                      </AlertDescription>
                    </Alert>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-1/2"
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        variant="destructive"
                        className="w-1/2 gap-2"
                        disabled={loading}
                        onClick={handleRemove}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 size={18} />
                            Confirm
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RemoveUser;
