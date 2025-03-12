
/**
 * Custom client for database operations without using Supabase authentication
 */

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Administrator",
    user_role: "admin",
    password: "password",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    user_role: "user",
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
  })
};
