
/**
 * Custom client for database operations without using Supabase authentication
 */

// Simple mock client for database operations
export const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null })
        }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ error: null })
      }),
      insert: (values: any[]) => Promise.resolve({ error: null })
    })
  })
};
