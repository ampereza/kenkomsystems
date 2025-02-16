
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { UserRole } from '@/lib/auth';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [requestedRole, setRequestedRole] = useState<UserRole>('stock_manager');
  const [resendTimeout, setResendTimeout] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              requested_role: requestedRole
            }
          }
        });

        if (!result.error) {
          toast({
            title: "Account created",
            description: "Please check your email to confirm your account before logging in.",
          });
          setIsSignUp(false); // Switch to login view
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (result.error?.message === "Email not confirmed") {
          if (!resendTimeout) {
            const { error: resendError } = await supabase.auth.resend({
              type: 'signup',
              email,
            });

            if (resendError) {
              // Check if it's a rate limit error
              if (resendError.status === 429) {
                const waitSeconds = resendError.message.match(/\d+/)?.[0] || '60';
                toast({
                  variant: "destructive",
                  title: "Please wait",
                  description: `You can request another confirmation email in ${waitSeconds} seconds.`,
                });
                setResendTimeout(true);
                setTimeout(() => setResendTimeout(false), parseInt(waitSeconds) * 1000);
              } else {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Error resending confirmation email. Please try again later.",
                });
              }
            } else {
              toast({
                title: "Confirmation email sent",
                description: "Please check your email to confirm your account. We've sent a new confirmation link.",
              });
              setResendTimeout(true);
              setTimeout(() => setResendTimeout(false), 60000); // Default 60s timeout
            }
          } else {
            toast({
              variant: "destructive",
              title: "Please wait",
              description: "Please wait before requesting another confirmation email.",
            });
          }
          return;
        }

        if (result.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error.message,
          });
          return;
        }

        navigate(from);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Create Account' : 'Login'}</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your details below to create your account'
              : 'Enter your email below to login to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="role">Requested Role</Label>
                <Select
                  value={requestedRole}
                  onValueChange={(value) => setRequestedRole(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_manager">General Manager</SelectItem>
                    <SelectItem value="managing_director">Managing Director</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="stock_manager">Stock Manager</SelectItem>
                    <SelectItem value="production_manager">Production Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {isSignUp && (
            <Alert variant="default" className="bg-muted">
              <Info className="h-4 w-4" />
              <AlertDescription>
                New accounts are created with limited access. A manager will review and update your role.
              </AlertDescription>
            </Alert>
          )}
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm"
          >
            {isSignUp
              ? 'Already have an account? Login'
              : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
