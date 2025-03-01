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
      client_deliveries: {
        Row: {
          client_id: string
          created_at: string | null
          delivery_date: string | null
          delivery_note_number: string | null
          id: string
          notes: string | null
          poles_10m: number | null
          poles_11m: number | null
          poles_12m: number | null
          poles_14m: number | null
          poles_16m: number | null
          poles_9m: number | null
          telecom_poles: number | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          delivery_date?: string | null
          delivery_note_number?: string | null
          id?: string
          notes?: string | null
          poles_10m?: number | null
          poles_11m?: number | null
          poles_12m?: number | null
          poles_14m?: number | null
          poles_16m?: number | null
          poles_9m?: number | null
          telecom_poles?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          delivery_date?: string | null
          delivery_note_number?: string | null
          id?: string
          notes?: string | null
          poles_10m?: number | null
          poles_11m?: number | null
          poles_12m?: number | null
          poles_14m?: number | null
          poles_16m?: number | null
          poles_9m?: number | null
          telecom_poles?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_deliveries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_stock: {
        Row: {
          client_id: string
          created_at: string | null
          delivered_10m_poles: number | null
          delivered_11m_poles: number | null
          delivered_12m_poles: number | null
          delivered_14m_poles: number | null
          delivered_16m_poles: number | null
          delivered_9m_poles: number | null
          delivered_telecom_poles: number | null
          id: string
          notes: string | null
          treated_10m_poles: number | null
          treated_11m_poles: number | null
          treated_12m_poles: number | null
          treated_14m_poles: number | null
          treated_16m_poles: number | null
          treated_9m_poles: number | null
          treated_telecom_poles: number | null
          untreated_10m_poles: number | null
          untreated_11m_poles: number | null
          untreated_12m_poles: number | null
          untreated_14m_poles: number | null
          untreated_16m_poles: number | null
          untreated_9m_poles: number | null
          untreated_telecom_poles: number | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          delivered_10m_poles?: number | null
          delivered_11m_poles?: number | null
          delivered_12m_poles?: number | null
          delivered_14m_poles?: number | null
          delivered_16m_poles?: number | null
          delivered_9m_poles?: number | null
          delivered_telecom_poles?: number | null
          id?: string
          notes?: string | null
          treated_10m_poles?: number | null
          treated_11m_poles?: number | null
          treated_12m_poles?: number | null
          treated_14m_poles?: number | null
          treated_16m_poles?: number | null
          treated_9m_poles?: number | null
          treated_telecom_poles?: number | null
          untreated_10m_poles?: number | null
          untreated_11m_poles?: number | null
          untreated_12m_poles?: number | null
          untreated_14m_poles?: number | null
          untreated_16m_poles?: number | null
          untreated_9m_poles?: number | null
          untreated_telecom_poles?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          delivered_10m_poles?: number | null
          delivered_11m_poles?: number | null
          delivered_12m_poles?: number | null
          delivered_14m_poles?: number | null
          delivered_16m_poles?: number | null
          delivered_9m_poles?: number | null
          delivered_telecom_poles?: number | null
          id?: string
          notes?: string | null
          treated_10m_poles?: number | null
          treated_11m_poles?: number | null
          treated_12m_poles?: number | null
          treated_14m_poles?: number | null
          treated_16m_poles?: number | null
          treated_9m_poles?: number | null
          treated_telecom_poles?: number | null
          untreated_10m_poles?: number | null
          untreated_11m_poles?: number | null
          untreated_12m_poles?: number | null
          untreated_14m_poles?: number | null
          untreated_16m_poles?: number | null
          untreated_9m_poles?: number | null
          untreated_telecom_poles?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_stock_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
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
      journal_entries: {
        Row: {
          created_at: string | null
          description: string | null
          entry_date: string | null
          id: string
          posted: boolean | null
          reference_number: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          entry_date?: string | null
          id?: string
          posted?: boolean | null
          reference_number?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          entry_date?: string | null
          id?: string
          posted?: boolean | null
          reference_number?: string | null
        }
        Relationships: []
      }
      journal_entry_lines: {
        Row: {
          account_id: string | null
          created_at: string | null
          credit_amount: number | null
          debit_amount: number | null
          description: string | null
          id: string
          journal_entry_id: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          id?: string
          journal_entry_id?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          id?: string
          journal_entry_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "ledger_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entry_lines_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_accounts: {
        Row: {
          account_code: string
          account_name: string
          account_type: string
          created_at: string | null
          id: string
        }
        Insert: {
          account_code: string
          account_name: string
          account_type: string
          created_at?: string | null
          id?: string
        }
        Update: {
          account_code?: string
          account_name?: string
          account_type?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
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
      rejected_poles_with_suppliers: {
        Row: {
          collected_date: string | null
          created_at: string | null
          delivery_note_number: string | null
          id: string
          notes: string | null
          quantity: number
          sorting_date: string | null
          supplier_id: string
        }
        Insert: {
          collected_date?: string | null
          created_at?: string | null
          delivery_note_number?: string | null
          id?: string
          notes?: string | null
          quantity: number
          sorting_date?: string | null
          supplier_id: string
        }
        Update: {
          collected_date?: string | null
          created_at?: string | null
          delivery_note_number?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          sorting_date?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rejected_poles_with_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
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
            referencedRelation: "treatment_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_costs_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_cylinders: {
        Row: {
          capacity_liters: number
          created_at: string | null
          cylinder_number: number
          id: string
          notes: string | null
        }
        Insert: {
          capacity_liters: number
          created_at?: string | null
          cylinder_number: number
          id?: string
          notes?: string | null
        }
        Update: {
          capacity_liters?: number
          created_at?: string | null
          cylinder_number?: number
          id?: string
          notes?: string | null
        }
        Relationships: []
      }
      treatments: {
        Row: {
          chemical_strength: number | null
          chemical_used: string | null
          client_id: string | null
          created_at: string | null
          cylinder_id: string | null
          distribution_poles: number | null
          facing_poles: number | null
          high_voltage_poles: number | null
          id: string
          is_client_owned: boolean | null
          kegs_added: number | null
          kegs_remaining: number | null
          notes: string | null
          quantity: number
          sorted_stock_id: string
          status: Database["public"]["Enums"]["treatment_status"] | null
          telecom_poles: number | null
          total_poles: number | null
          treatment_date: string | null
          water_added_liters: number | null
        }
        Insert: {
          chemical_strength?: number | null
          chemical_used?: string | null
          client_id?: string | null
          created_at?: string | null
          cylinder_id?: string | null
          distribution_poles?: number | null
          facing_poles?: number | null
          high_voltage_poles?: number | null
          id?: string
          is_client_owned?: boolean | null
          kegs_added?: number | null
          kegs_remaining?: number | null
          notes?: string | null
          quantity: number
          sorted_stock_id: string
          status?: Database["public"]["Enums"]["treatment_status"] | null
          telecom_poles?: number | null
          total_poles?: number | null
          treatment_date?: string | null
          water_added_liters?: number | null
        }
        Update: {
          chemical_strength?: number | null
          chemical_used?: string | null
          client_id?: string | null
          created_at?: string | null
          cylinder_id?: string | null
          distribution_poles?: number | null
          facing_poles?: number | null
          high_voltage_poles?: number | null
          id?: string
          is_client_owned?: boolean | null
          kegs_added?: number | null
          kegs_remaining?: number | null
          notes?: string | null
          quantity?: number
          sorted_stock_id?: string
          status?: Database["public"]["Enums"]["treatment_status"] | null
          telecom_poles?: number | null
          total_poles?: number | null
          treatment_date?: string | null
          water_added_liters?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatments_cylinder_id_fkey"
            columns: ["cylinder_id"]
            isOneToOne: false
            referencedRelation: "treatment_cylinders"
            referencedColumns: ["id"]
          },
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
      balance_sheet: {
        Row: {
          account_code: string | null
          account_name: string | null
          account_type: string | null
          balance: number | null
        }
        Relationships: []
      }
      client_stock_summary: {
        Row: {
          client_name: string | null
          delivered_10m_poles: number | null
          delivered_11m_poles: number | null
          delivered_12m_poles: number | null
          delivered_14m_poles: number | null
          delivered_16m_poles: number | null
          delivered_9m_poles: number | null
          delivered_telecom_poles: number | null
          id: string | null
          treated_10m_poles: number | null
          treated_11m_poles: number | null
          treated_12m_poles: number | null
          treated_14m_poles: number | null
          treated_16m_poles: number | null
          treated_9m_poles: number | null
          treated_telecom_poles: number | null
          untreated_10m_poles: number | null
          untreated_11m_poles: number | null
          untreated_12m_poles: number | null
          untreated_14m_poles: number | null
          untreated_16m_poles: number | null
          untreated_9m_poles: number | null
          untreated_telecom_poles: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      employee_payments: {
        Row: {
          amount: number | null
          employee_name: string | null
          payment_date: string | null
          payment_period_end: string | null
          payment_period_start: string | null
          position: string | null
        }
        Relationships: []
      }
      financial_summary: {
        Row: {
          date: string | null
          total_amount: number | null
          transaction_count: number | null
          type: Database["public"]["Enums"]["transaction_type"] | null
        }
        Relationships: []
      }
      income_statement: {
        Row: {
          account_code: string | null
          account_name: string | null
          account_type: string | null
          amount: number | null
          description: string | null
          entry_date: string | null
          reference_number: string | null
        }
        Relationships: []
      }
      income_statement_by_account: {
        Row: {
          account_code: string | null
          account_name: string | null
          account_type: string | null
          total_amount: number | null
        }
        Relationships: []
      }
      income_statement_summary: {
        Row: {
          account_type: string | null
          total_amount: number | null
        }
        Relationships: []
      }
      rejected_poles_summary: {
        Row: {
          date: string | null
          pending_collections: number | null
          supplier_name: string | null
          total_quantity: number | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          category: Database["public"]["Enums"]["pole_category"] | null
          date: string | null
          size: Database["public"]["Enums"]["pole_size"] | null
          total_quantity: number | null
        }
        Relationships: []
      }
      supplier_transactions: {
        Row: {
          amount: number | null
          reference_number: string | null
          supplier_name: string | null
          transaction_date: string | null
          type: Database["public"]["Enums"]["transaction_type"] | null
        }
        Relationships: []
      }
      treatment_summary: {
        Row: {
          chemical_strength: number | null
          chemical_used: string | null
          client_name: string | null
          cylinder_number: number | null
          distribution_poles: number | null
          facing_poles: number | null
          high_voltage_poles: number | null
          id: string | null
          kegs_added: number | null
          kegs_remaining: number | null
          notes: string | null
          status: Database["public"]["Enums"]["treatment_status"] | null
          telecom_poles: number | null
          total_poles: number | null
          treatment_date: string | null
          water_added_liters: number | null
        }
        Relationships: []
      }
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
      user_role:
        | "general_manager"
        | "managing_director"
        | "accountant"
        | "stock_manager"
        | "production_manager"
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
