
/**
 * Custom client for database operations without using Supabase authentication
 */

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Administrator",
    user_role: "managing_director",
    password: "password",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    email: "finance@example.com",
    name: "Finance Manager",
    user_role: "accountant",
    password: "password",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    email: "stock@example.com",
    name: "Stock Manager",
    user_role: "stock_manager",
    password: "password",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    email: "production@example.com",
    name: "Production Manager",
    user_role: "production_manager",
    password: "password",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Simple mock client for database operations
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = "*") => ({
      eq: (column: string, value: any) => ({
        eq: (column2: string, value2: any) => ({
          single: () => {
            if (table === "users") {
              const user = mockUsers.find(user => 
                user[column as keyof typeof user] === value && 
                user[column2 as keyof typeof user] === value2
              );
              return Promise.resolve({ data: user || null, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          }
        }),
        single: () => {
          if (table === "users") {
            const user = mockUsers.find(user => user[column as keyof typeof user] === value);
            return Promise.resolve({ data: user || null, error: user ? null : new Error("User not found") });
          }
          return Promise.resolve({ data: null, error: null });
        }
      }),
      single: () => {
        return Promise.resolve({ data: null, error: null });
      },
      contains: (column: string, value: any) => {
        return {
          data: [],
          error: null
        };
      },
      in: (column: string, values: any[]) => ({
        gte: (column: string, value: any) => ({
          lte: (column: string, value: any) => ({
            data: [],
            error: null
          })
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => {
        if (table === "users") {
          const userIndex = mockUsers.findIndex(user => user[column as keyof typeof user] === value);
          if (userIndex !== -1) {
            mockUsers.splice(userIndex, 1);
          }
        }
        return Promise.resolve({ error: null });
      }
    }),
    insert: (values: any) => {
      if (table === "users") {
        if (Array.isArray(values)) {
          for (const value of values) {
            mockUsers.push({
              ...value,
              id: String(mockUsers.length + 1),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        } else {
          mockUsers.push({
            ...values,
            id: String(mockUsers.length + 1),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
      if (table === "client_deliveries") {
        return Promise.resolve({ error: null });
      }
      return Promise.resolve({ error: null });
    },
    _mockUsers: mockUsers
  }),
  
  auth: {
    getSession: () => {
      const userId = localStorage.getItem("userId");
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      
      if (isAuthenticated && userId) {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          return Promise.resolve({
            data: {
              session: {
                user: {
                  id: user.id,
                  email: user.email,
                  user_metadata: {
                    name: user.name,
                    role: user.user_role
                  }
                }
              }
            },
            error: null
          });
        }
      }
      
      return Promise.resolve({ data: { session: null }, error: null });
    },
    
    onAuthStateChange: (callback: any) => {
      const handleStorageChange = () => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        const userId = localStorage.getItem("userId");
        
        if (isAuthenticated && userId) {
          const user = mockUsers.find(u => u.id === userId);
          if (user) {
            callback('SIGNED_IN', {
              session: {
                user: {
                  id: user.id,
                  email: user.email,
                  user_metadata: {
                    name: user.name,
                    role: user.user_role
                  }
                }
              }
            });
          }
        } else {
          callback('SIGNED_OUT', null);
        }
      };
      
      handleStorageChange();
      
      window.addEventListener('storage', handleStorageChange);
      document.addEventListener('visibilitychange', handleStorageChange);
      
      return {
        unsubscribe: () => {
          window.removeEventListener('storage', handleStorageChange);
          document.removeEventListener('visibilitychange', handleStorageChange);
        }
      };
    },
    
    signOut: () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      return Promise.resolve({ error: null });
    },

    signInWithPassword: ({ email, password }: { email: string; password: string }) => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userRole", user.user_role);
        
        return Promise.resolve({
          data: {
            user: {
              id: user.id,
              email: user.email,
              user_metadata: {
                name: user.name,
                role: user.user_role
              }
            },
            session: {
              user: {
                id: user.id,
                email: user.email,
                user_metadata: {
                  name: user.name,
                  role: user.user_role
                }
              }
            }
          },
          error: null
        });
      } else {
        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Invalid email or password. Try admin@example.com / password" }
        });
      }
    },

    signInWithOAuth: ({ provider, options }: { provider: string, options?: any }) => {
      // Mock Google sign-in for development/demo purposes
      if (provider === 'google') {
        // For demo purposes, let's automatically log in as admin
        const user = mockUsers[0]; // Use the first mock user (admin)
        
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userRole", user.user_role);
        
        // In a real implementation, this would redirect to Google
        // For our mock, we'll simulate a successful sign-in
        
        // Return a URL to simulate redirect (though we'll handle it in the UI)
        return Promise.resolve({
          data: { url: `${window.location.origin}/auth-callback?provider=google&success=true` },
          error: null
        });
      }
      
      return Promise.resolve({
        data: null,
        error: { message: "Provider not supported in mock implementation" }
      });
    }
  }
};
