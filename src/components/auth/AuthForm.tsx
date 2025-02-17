
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
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
import type { UserRole } from '@/lib/auth';

interface AuthFormProps {
  isSignUp: boolean;
  onSuccess: () => void;
  onAuthError: (error: { status?: number; message: string }) => void;
}

export function AuthForm({ isSignUp, onSuccess, onAuthError }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestedRole, setRequestedRole] = useState<UserRole>('stock_manager');
  const { toast } = useToast();

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

        if (result.error?.status === 422 && result.error.message.includes("already registered")) {
          onAuthError(result.error);
        } else if (!result.error) {
          toast({
            title: "Account created",
            description: "Please check your email to confirm your account before logging in.",
          });
          onSuccess();
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error.message,
          });
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (result.error) {
          onAuthError(result.error);
        } else {
          onSuccess();
        }
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
  );
}
