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
      chart_of_accounts: {
        Row: {
          account_category: string
          account_name: string
          account_number: string
          account_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          parent_account_id: string | null
          updated_at: string
        }
        Insert: {
          account_category: string
          account_name: string
          account_number: string
          account_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          parent_account_id?: string | null
          updated_at?: string
        }
        Update: {
          account_category?: string
          account_name?: string
          account_number?: string
          account_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          parent_account_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      client_deliveries: {
        Row: {
          client_id: string | null
          created_at: string | null
          delivery_date: string | null
          delivery_note: string | null
          delivery_status: string | null
          id: string
          quantity: number
          received_by: string | null
          remarks: string | null
          treatment_id: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          delivery_note?: string | null
          delivery_status?: string | null
          id?: string
          quantity: number
          received_by?: string | null
          remarks?: string | null
          treatment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          delivery_note?: string | null
          delivery_status?: string | null
          id?: string
          quantity?: number
          received_by?: string | null
          remarks?: string | null
          treatment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_deliveries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_deliveries_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatment_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_deliveries_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      client_ledgers: {
        Row: {
          client_id: string
          created_at: string
          current_balance: number | null
          id: string
          is_active: boolean | null
          last_transaction_date: string | null
          opening_balance: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          last_transaction_date?: string | null
          opening_balance?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          last_transaction_date?: string | null
          opening_balance?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_ledgers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_poles_stock: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          quantity: number
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
          client_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity?: number
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
          client_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quantity?: number
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
            foreignKeyName: "client_poles_stock_client_id_fkey"
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
      customers: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: number
          telepnone: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: number
          telepnone?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: number
          telepnone?: string | null
        }
        Relationships: []
      }
      delivery_note_items: {
        Row: {
          created_at: string
          delivery_note_id: string
          description: string | null
          id: string
          item_number: string | null
          quantity: number
          remarks: string | null
        }
        Insert: {
          created_at?: string
          delivery_note_id: string
          description?: string | null
          id?: string
          item_number?: string | null
          quantity?: number
          remarks?: string | null
        }
        Update: {
          created_at?: string
          delivery_note_id?: string
          description?: string | null
          id?: string
          item_number?: string | null
          quantity?: number
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_note_items_delivery_note_id_fkey"
            columns: ["delivery_note_id"]
            isOneToOne: false
            referencedRelation: "delivery_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_notes: {
        Row: {
          created_at: string
          date: string
          driver_sign: boolean | null
          id: string
          loaded_at: string | null
          loaded_by: string | null
          note_number: string
          notes: string | null
          received_at: string | null
          received_by: string | null
          to_name: string | null
          total_quantity: number
          transporter: string | null
          vehicle_number: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          driver_sign?: boolean | null
          id?: string
          loaded_at?: string | null
          loaded_by?: string | null
          note_number: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          to_name?: string | null
          total_quantity?: number
          transporter?: string | null
          vehicle_number?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          driver_sign?: boolean | null
          id?: string
          loaded_at?: string | null
          loaded_by?: string | null
          note_number?: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          to_name?: string | null
          total_quantity?: number
          transporter?: string | null
          vehicle_number?: string | null
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
          payment_type: string | null
          position: string
          salary: number | null
        }
        Insert: {
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          hire_date: string
          id?: string
          name: string
          payment_type?: string | null
          position: string
          salary?: number | null
        }
        Update: {
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          hire_date?: string
          id?: string
          name?: string
          payment_type?: string | null
          position?: string
          salary?: number | null
        }
        Relationships: []
      }
      expense_authorizations: {
        Row: {
          authorization_number: string
          balance: number | null
          being_payment_of: string | null
          cash_cheque_no: string | null
          created_at: string
          date: string
          id: string
          received_from: string | null
          signature: string | null
          sum_of_shillings: number
        }
        Insert: {
          authorization_number: string
          balance?: number | null
          being_payment_of?: string | null
          cash_cheque_no?: string | null
          created_at?: string
          date?: string
          id?: string
          received_from?: string | null
          signature?: string | null
          sum_of_shillings?: number
        }
        Update: {
          authorization_number?: string
          balance?: number | null
          being_payment_of?: string | null
          cash_cheque_no?: string | null
          created_at?: string
          date?: string
          id?: string
          received_from?: string | null
          signature?: string | null
          sum_of_shillings?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          payment_method: string | null
          reference_number: string | null
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          reference_number?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          reference_number?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_goals: {
        Row: {
          created_at: string | null
          current_amount: number
          deadline: string | null
          id: string
          name: string
          target_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number
          deadline?: string | null
          id?: string
          name: string
          target_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number
          deadline?: string | null
          id?: string
          name?: string
          target_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_periods: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_closed: boolean | null
          period_name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_closed?: boolean | null
          period_name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_closed?: boolean | null
          period_name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity: number
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string | null
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          paid_amount: number | null
          status: string
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          notes?: string | null
          paid_amount?: number | null
          status?: string
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
          account_code: string | null
          account_name: string
          account_type: string
          balance: number | null
          created_at: string | null
          id: string
        }
        Insert: {
          account_code?: string | null
          account_name: string
          account_type: string
          balance?: number | null
          created_at?: string | null
          id?: string
        }
        Update: {
          account_code?: string | null
          account_name?: string
          account_type?: string
          balance?: number | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          entry_date: string
          entry_type: string
          id: string
          ledger_id: string
          running_balance: number
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          entry_date?: string
          entry_type: string
          id?: string
          ledger_id: string
          running_balance: number
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          entry_date?: string
          entry_type?: string
          id?: string
          ledger_id?: string
          running_balance?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_ledger_id_fkey"
            columns: ["ledger_id"]
            isOneToOne: false
            referencedRelation: "client_ledgers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_voucher_items: {
        Row: {
          amount: number
          created_at: string
          id: string
          particulars: string
          payment_voucher_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          particulars: string
          payment_voucher_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          particulars?: string
          payment_voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_voucher_items_payment_voucher_id_fkey"
            columns: ["payment_voucher_id"]
            isOneToOne: false
            referencedRelation: "payment_vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_vouchers: {
        Row: {
          amount_in_words: string | null
          created_at: string
          date: string
          id: string
          paid_to: string
          payment_approved_by: string | null
          received_by: string | null
          supplier_id: string | null
          total_amount: number
          voucher_number: string
        }
        Insert: {
          amount_in_words?: string | null
          created_at?: string
          date?: string
          id?: string
          paid_to: string
          payment_approved_by?: string | null
          received_by?: string | null
          supplier_id?: string | null
          total_amount?: number
          voucher_number: string
        }
        Update: {
          amount_in_words?: string | null
          created_at?: string
          date?: string
          id?: string
          paid_to?: string
          payment_approved_by?: string | null
          received_by?: string | null
          supplier_id?: string | null
          total_amount?: number
          voucher_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_vouchers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_config: {
        Row: {
          category: string
          created_at: string
          id: string
          purchase_price: number
          sale_price: number
          treatment_price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          purchase_price?: number
          sale_price?: number
          treatment_price?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          purchase_price?: number
          sale_price?: number
          treatment_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          user_role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          user_role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      receipts: {
        Row: {
          amount: number
          created_at: string
          date: string
          for_payment: string | null
          id: string
          payment_method: string | null
          receipt_number: string
          received_from: string | null
          signature: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          date?: string
          for_payment?: string | null
          id?: string
          payment_method?: string | null
          receipt_number: string
          received_from?: string | null
          signature?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          for_payment?: string | null
          id?: string
          payment_method?: string | null
          receipt_number?: string
          received_from?: string | null
          signature?: string | null
        }
        Relationships: []
      }
      rejected_Poles: {
        Row: {
          category: string | null
          created_at: string
          id: number
          quantity: number | null
          supplier_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: number
          quantity?: number | null
          supplier_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          quantity?: number | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rejected_Poles_supplier_id_fkey"
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
      tax_rates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          rate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          rate: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rate?: number
          updated_at?: string
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
      treated_stock: {
        Row: {
          category: string
          chemical_strength: string | null
          created_at: string | null
          diameter_mm: number | null
          id: string
          length_unit: string | null
          length_value: number
          notes: string | null
          quantity: number
          source_sorted_stock_id: string | null
          status: string | null
          treatment_chemical: string | null
          treatment_date: string | null
        }
        Insert: {
          category: string
          chemical_strength?: string | null
          created_at?: string | null
          diameter_mm?: number | null
          id?: string
          length_unit?: string | null
          length_value: number
          notes?: string | null
          quantity: number
          source_sorted_stock_id?: string | null
          status?: string | null
          treatment_chemical?: string | null
          treatment_date?: string | null
        }
        Update: {
          category?: string
          chemical_strength?: string | null
          created_at?: string | null
          diameter_mm?: number | null
          id?: string
          length_unit?: string | null
          length_value?: number
          notes?: string | null
          quantity?: number
          source_sorted_stock_id?: string | null
          status?: string | null
          treatment_chemical?: string | null
          treatment_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treated_stock_source_sorted_stock_id_fkey"
            columns: ["source_sorted_stock_id"]
            isOneToOne: false
            referencedRelation: "sorted_stock"
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
      treatment_log: {
        Row: {
          client_id: string | null
          created_at: string
          cylinder_number: string
          date: string
          id: string
          kegs_added: number
          kegs_remaining: number
          liters_added: string
          poles_10m: number | null
          poles_11m: number | null
          poles_12m: number | null
          poles_14m: number | null
          poles_16m: number | null
          poles_9m: number | null
          rafters: number | null
          strength_percentage: number
          telecom_poles: number | null
          timber: number | null
          total_poles: number
          treatment_purpose: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          cylinder_number: string
          date?: string
          id?: string
          kegs_added?: number
          kegs_remaining?: number
          liters_added: string
          poles_10m?: number | null
          poles_11m?: number | null
          poles_12m?: number | null
          poles_14m?: number | null
          poles_16m?: number | null
          poles_9m?: number | null
          rafters?: number | null
          strength_percentage: number
          telecom_poles?: number | null
          timber?: number | null
          total_poles: number
          treatment_purpose: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          cylinder_number?: string
          date?: string
          id?: string
          kegs_added?: number
          kegs_remaining?: number
          liters_added?: string
          poles_10m?: number | null
          poles_11m?: number | null
          poles_12m?: number | null
          poles_14m?: number | null
          poles_16m?: number | null
          poles_9m?: number | null
          rafters?: number | null
          strength_percentage?: number
          telecom_poles?: number | null
          timber?: number | null
          total_poles?: number
          treatment_purpose?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
      income_statement_summary: {
        Row: {
          account_type: string | null
          total_amount: number | null
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
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      pole_category:
        | "fencing"
        | "telecom"
        | "distribution"
        | "high_voltage"
        | "rejected"
      pole_size: "small" | "medium" | "stout"
      pole_type:
        | "telecom"
        | "timber"
        | "rafters"
        | "9m"
        | "10m"
        | "11m"
        | "12m"
        | "14m"
        | "16m"
      processing_status: "pending" | "completed" | "cancelled"
      transaction_type:
        | "purchase"
        | "sale"
        | "expense"
        | "salary"
        | "treatment_income"
      treatment_purpose: "KDL" | "Client"
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
