
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserRole } from './AuthProvider';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  role: z.enum(['managing_director', 'general_manager', 'production_manager', 'stock_manager', 'accountant'], {
    required_error: 'Please select a role',
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Define default user accounts
const defaultAccounts = [
  { email: 'md@kenkomdistributorsltd.com', role: 'managing_director' as UserRole, title: 'Managing Director' },
  { email: 'gm@kenkomdistributorsltd.com', role: 'general_manager' as UserRole, title: 'General Manager' },
  { email: 'pm@kenkomdistributorsltd.com', role: 'production_manager' as UserRole, title: 'Production Manager' },
  { email: 'sm@kenkomdistributorsltd.com', role: 'stock_manager' as UserRole, title: 'Stock Manager' },
  { email: 'accountant@kenkomdistributorsltd.com', role: 'accountant' as UserRole, title: 'Accountant' },
];

export function AuthForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'md@kenkomdistributorsltd.com',
      password: 'Password123',
      role: 'managing_director',
    },
  });

  // Handle selecting a predefined account
  const handleAccountSelect = (email: string) => {
    const account = defaultAccounts.find(acc => acc.email === email);
    if (account) {
      form.setValue('email', account.email);
      form.setValue('role', account.role);
      form.setValue('password', 'Password123');
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log('Attempting to log in with:', values.email);
      
      // First try to sign in with existing credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        console.error('Login error details:', authError);
        
        // Provide more specific error message
        if (authError.message.includes('Invalid login credentials')) {
          setLoginError('Invalid email or password. Please verify your credentials and try again.');
        } else {
          setLoginError(authError.message);
        }
        
        // Display toast with error message
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: 'Invalid email or password. Please verify your credentials and try again.',
        });
        
        setIsLoading(false);
        return;
      }

      console.log('Login successful:', authData);
      
      // After successful login, show a success toast
      toast({
        title: "Success",
        description: "You've been logged in successfully.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = "Failed to log in. Please check your credentials.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">KDL Management System</CardTitle>
        <CardDescription className="text-center">
          Access your account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription>
              {loginError}
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleAccountSelect(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {defaultAccounts.map((account) => (
                        <SelectItem key={account.email} value={account.email}>
                          {account.title} ({account.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormControl>
                    <Input 
                      className="mt-2" 
                      placeholder="Or enter email manually" 
                      type="email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="managing_director">Managing Director</SelectItem>
                      <SelectItem value="general_manager">General Manager</SelectItem>
                      <SelectItem value="production_manager">Production Manager</SelectItem>
                      <SelectItem value="stock_manager">Stock Manager</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This determines what parts of the system you can access
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Default password for demo accounts is: Password123
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <Separator className="my-4" />
        <p className="text-sm text-center text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
}
