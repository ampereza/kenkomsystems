
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, UserRole } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Edit } from 'lucide-react';

// User data type
interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

// Form schema for user creation
const userFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  full_name: z.string().optional(),
  role: z.enum(['managing_director', 'general_manager', 'production_manager', 'stock_manager', 'accountant']),
});

// Form schema for user editing (no password)
const editUserFormSchema = z.object({
  full_name: z.string().optional(),
  role: z.enum(['managing_director', 'general_manager', 'production_manager', 'stock_manager', 'accountant']),
});

export default function UserManagement() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form setup for creating users
  const createForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      role: 'stock_manager',
    },
  });

  // Form setup for editing users
  const editForm = useForm<z.infer<typeof editUserFormSchema>>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      full_name: '',
      role: 'stock_manager',
    },
  });

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
  });

  // Create user mutation
  const createUser = useMutation({
    mutationFn: async (values: z.infer<typeof userFormSchema>) => {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          full_name: values.full_name,
        },
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: values.role, full_name: values.full_name })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;
      
      return authData.user;
    },
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "The user account has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user.",
      });
    },
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: z.infer<typeof editUserFormSchema> }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: values.role,
          full_name: values.full_name,
        })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "The user account has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user.",
      });
    },
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast({
        title: "User Deleted",
        description: "The user account has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user.",
      });
    },
  });

  // Handle user creation form submission
  const onCreateUser = (values: z.infer<typeof userFormSchema>) => {
    createUser.mutate(values);
  };

  // Handle user edit form submission
  const onEditUser = (values: z.infer<typeof editUserFormSchema>) => {
    if (selectedUser) {
      updateUser.mutate({ id: selectedUser.id, values });
    }
  };

  // Setup edit mode for a user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      full_name: user.full_name || '',
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  // Handle user deletion with confirmation
  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser.mutate(id);
    }
  };

  // Check if the current user is authorized to manage users
  const canManageUsers = profile?.role === 'managing_director' || profile?.role === 'general_manager';

  if (!canManageUsers) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <p className="text-red-500">You don't have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system with their role and permissions.
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateUser)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
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
                <DialogFooter>
                  <Button type="submit" disabled={createUser.isPending}>
                    {createUser.isPending ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">{user.full_name || 'N/A'}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    {user.role?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === profile?.id} // Prevent deleting own account
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and role.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditUser)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
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
              <DialogFooter>
                <Button type="submit" disabled={updateUser.isPending}>
                  {updateUser.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
