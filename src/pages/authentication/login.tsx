
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isLoading, isAuthenticated } = useAuth();

  function getDashboardByRole() {
    if (!profile) return "/dashboards/financial";

    // Custom domain redirection based on role
    const baseDomain = "kdl.kenkomdistributorsltd.com"; // ✅
    
    switch (profile.role) {
      case "accountant":
        return `finance`;
      case "stock_manager":
        return `stock-manager`;
      case "production_manager":
        return `production-manager`;
      case "general_manager":
        return `general-manager`;
      case "managing_director":
        return `managing-director`;

      case "developer":
        return `maindashboard`; // ✅ Correct
            default:
        return `/default`;
    }
  }

  // Redirect if already authenticated
    useEffect(() => {
      if (!isLoading && isAuthenticated && profile) {
        const dashboardPath = getDashboardByRole();
        console.log("Redirecting to dashboard:", dashboardPath);
    
        if (dashboardPath.startsWith("http")) {
          window.location.href = dashboardPath; // ✅ Clean way for external
        } else {
          navigate(dashboardPath, { replace: true });
        }
      }
    }, [isLoading, isAuthenticated, profile, navigate]);


    const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };


  // If already authenticated, we'll redirect in the useEffect
  if (isAuthenticated && profile) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-1 bg-slate-50 rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <LogIn className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Sign in with Google to access the system
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="button"
                className="w-full flex items-center justify-center gap-2 transition-all"
                disabled={loading}
                onClick={handleGoogleLogin}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Redirecting...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign in with Google
                  </>
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col text-sm text-center text-muted-foreground p-6 pt-0">
            <div className="text-xs text-slate-500 mt-1">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
