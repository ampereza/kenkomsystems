
import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RemoveUser: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRemove = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Mock successful user removal
      setTimeout(() => {
        setSuccess("User removed successfully.");
        setEmail("");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={18} />
            </Link>
            <CardTitle className="text-2xl font-bold">Remove User</CardTitle>
          </div>
          <CardDescription>
            Remove a user from the system
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleRemove} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user.to.remove@example.com"
                required
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-green-50 border-green-500 text-green-700">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="pt-2">
              <Alert className="bg-amber-50 border-amber-500 text-amber-700">
                <AlertDescription>
                  Warning: This action cannot be undone. The user will be permanently removed from the system.
                </AlertDescription>
              </Alert>
            </div>
            
            <Button 
              type="submit" 
              variant="destructive"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Removing..." : "Remove User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RemoveUser;
