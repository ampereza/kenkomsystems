
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
    select: (columns: string) => ({
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
            return Promise.resolve({ data: user || null, error: null });
          }
          return Promise.resolve({ data: null, error: null });
        }
      }),
      single: () => {
        return Promise.resolve({ data: null, error: null });
      }
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
    insert: (values: any[]) => {
      if (table === "users") {
        for (const value of values) {
          mockUsers.push({
            ...value,
            id: String(mockUsers.length + 1),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
      return Promise.resolve({ error: null });
    },
    // For development purposes, expose the mockUsers
    _mockUsers: mockUsers
  }),
  
  // Add a simple auth interface that mimics Supabase auth
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
            }
          });
        }
      }
      
      return Promise.resolve({ data: { session: null } });
    },
    
    onAuthStateChange: (callback: any) => {
      // Listen for storage events to detect login/logout
      const handleStorageChange = () => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        const userId = localStorage.getItem("userId");
        
        if (isAuthenticated && userId) {
          const user = mockUsers.find(u => u.id === userId);
          if (user) {
            callback('SIGNED_IN', {
              user: {
                id: user.id,
                email: user.email,
                user_metadata: {
                  name: user.name,
                  role: user.user_role
                }
              }
            });
          }
        } else {
          callback('SIGNED_OUT', null);
        }
      };
      
      // Check immediately
      handleStorageChange();
      
      // Add listener
      window.addEventListener('storage', handleStorageChange);
      document.addEventListener('visibilitychange', handleStorageChange);
      
      // Return unsubscribe function
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
    }
  }
};
