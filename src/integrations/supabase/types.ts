export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          contact_number: string | null
          created_at: string | null
          email: string | null
          hire_date: string
          id: string
          name: string
          position: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          hire_date: string
          id?: string
          name: string
          position: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          hire_date?: string
          id?: string
          name?: string
          position?: string
        }
        Relationships: []
      }
      received_sorted_stock: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          processing_status: Database["public"]["Enums"]["processing_status"]
          quantity: number
          received_date: string | null
          sorted_stock_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          processing_status?: Database["public"]["Enums"]["processing_status"]
          quantity: number
          received_date?: string | null
          sorted_stock_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          processing_status?: Database["public"]["Enums"]["processing_status"]
          quantity?: number
          received_date?: string | null
          sorted_stock_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "received_sorted_stock_sorted_stock_id_fkey"
            columns: ["sorted_stock_id"]
            isOneToOne: false
            referencedRelation: "sorted_stock"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_payments: {
        Row: {
          amount: number
          created_at: string | null
          employee_id: string
          id: string
          payment_date: string
          payment_period_end: string
          payment_period_start: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          employee_id: string
          id?: string
          payment_date: string
          payment_period_end: string
          payment_period_start: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          employee_id?: string
          id?: string
          payment_date?: string
          payment_period_end?: string
          payment_period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_payments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      sorted_stock: {
        Row: {
          category: Database["public"]["Enums"]["pole_category"]
          created_at: string | null
          diameter_mm: number | null
          id: string
          length_unit: string | null
          length_value: number | null
          notes: string | null
          quantity: number
          size: Database["public"]["Enums"]["pole_size"] | null
          sorting_date: string | null
          unsorted_stock_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["pole_category"]
          created_at?: string | null
          diameter_mm?: number | null
          id?: string
          length_unit?: string | null
          length_value?: number | null
          notes?: string | null
          quantity: number
          size?: Database["public"]["Enums"]["pole_size"] | null
          sorting_date?: string | null
          unsorted_stock_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["pole_category"]
          created_at?: string | null
          diameter_mm?: number | null
          id?: string
          length_unit?: string | null
          length_value?: number | null
          notes?: string | null
          quantity?: number
          size?: Database["public"]["Enums"]["pole_size"] | null
          sorting_date?: string | null
          unsorted_stock_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sorted_stock_unsorted_stock_id_fkey"
            columns: ["unsorted_stock_id"]
            isOneToOne: false
            referencedRelation: "unsorted_stock"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          reference_number: string | null
          sorted_stock_id: string | null
          supplier_id: string | null
          transaction_date: string | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          reference_number?: string | null
          sorted_stock_id?: string | null
          supplier_id?: string | null
          transaction_date?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          reference_number?: string | null
          sorted_stock_id?: string | null
          supplier_id?: string | null
          transaction_date?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_sorted_stock_id_fkey"
            columns: ["sorted_stock_id"]
            isOneToOne: false
            referencedRelation: "sorted_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_costs: {
        Row: {
          amount: number
          cost_type: string
          created_at: string | null
          id: string
          treatment_id: string
        }
        Insert: {
          amount: number
          cost_type: string
          created_at?: string | null
          id?: string
          treatment_id: string
        }
        Update: {
          amount?: number
          cost_type?: string
          created_at?: string | null
          id?: string
          treatment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_costs_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          chemical_used: string | null
          created_at: string | null
          id: string
          notes: string | null
          quantity: number
          sorted_stock_id: string
          status: Database["public"]["Enums"]["treatment_status"] | null
          treatment_date: string | null
        }
        Insert: {
          chemical_used?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity: number
          sorted_stock_id: string
          status?: Database["public"]["Enums"]["treatment_status"] | null
          treatment_date?: string | null
        }
        Update: {
          chemical_used?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          sorted_stock_id?: string
          status?: Database["public"]["Enums"]["treatment_status"] | null
          treatment_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatments_sorted_stock_id_fkey"
            columns: ["sorted_stock_id"]
            isOneToOne: false
            referencedRelation: "sorted_stock"
            referencedColumns: ["id"]
          },
        ]
      }
      unsorted_stock: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          quantity: number
          received_date: string | null
          supplier_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity: number
          received_date?: string | null
          supplier_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          received_date?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unsorted_stock_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pole_category:
        | "fencing"
        | "telecom"
        | "distribution"
        | "high_voltage"
        | "rejected"
      pole_size: "small" | "medium" | "stout"
      processing_status: "pending" | "completed" | "cancelled"
      transaction_type:
        | "purchase"
        | "sale"
        | "expense"
        | "salary"
        | "treatment_income"
      treatment_status: "pending" | "in_progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
