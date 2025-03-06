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
import { Switch } from '@/components/ui/switch';
import { UserRole } from './AuthProvider';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }).default('admin@kenkomdistributors.ltd'),
  password: z.string().optional(),
  role: z.enum(['managing_director', 'general_manager', 'production_manager', 'stock_manager', 'accountant'], {
    required_error: 'Please select a role',
  }),
  usePassword: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function AuthForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [usePassword, setUsePassword] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@kenkomdistributors.ltd',
      password: '',
      role: 'stock_manager',
      usePassword: true,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    
    try {
      // Determine authentication method
      if (values.usePassword && values.password) {
        // Sign in with password
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          throw error;
        }
      } else {
        // Sign in without password (for development only)
        // This would typically require a more secure approach in production
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: 'development_password', // This is a placeholder; in a real app, you would use proper passwordless auth
        });

        if (error) {
          throw error;
        }

        // In a real implementation, you might want to use magic link or passwordless auth:
        // const { error } = await supabase.auth.signInWithOtp({
        //   email: values.email,
        // });
      }

      // After successful authentication, update the user's role if needed
      // Note: This would require appropriate RLS policies to be in place
      // const { error: updateError } = await supabase
      //   .from('profiles')
      //   .update({ role: values.role })
      //   .eq('email', values.email);
      
      // if (updateError) {
      //   console.error('Failed to update role:', updateError);
      // }

      toast({
        title: "Success",
        description: "You've been logged in successfully.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to log in. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordMode = () => {
    const currentValue = form.getValues('usePassword');
    form.setValue('usePassword', !currentValue);
    setUsePassword(!currentValue);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">KDL Management System</CardTitle>
        <CardDescription className="text-center">Access your account</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@kenkomdistributors.ltd" type="email" {...field} />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="usePassword"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Use Password</FormLabel>
                    <FormDescription>
                      {usePassword ? "Sign in with a password" : "Sign in without a password"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setUsePassword(checked);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {usePassword && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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
