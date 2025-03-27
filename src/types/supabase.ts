export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'USER' | 'ADMIN' | 'MASTER_ADMIN'
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          status: 'active' | 'inactive' | 'blocked'
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: 'USER' | 'ADMIN' | 'MASTER_ADMIN'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          status?: 'active' | 'inactive' | 'blocked'
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'USER' | 'ADMIN' | 'MASTER_ADMIN'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          status?: 'active' | 'inactive' | 'blocked'
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          document: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          created_at: string
          updated_at: string
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          name: string
          document: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: string
          name?: string
          document?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive'
        }
      }
      proposals: {
        Row: {
          id: string
          client_id: string
          number: string
          type: 'PIS' | 'COFINS' | 'ICMS' | 'IPI' | 'OUTROS'
          status: 'draft' | 'pending' | 'approved' | 'rejected'
          value: number
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          number?: string
          type: 'PIS' | 'COFINS' | 'ICMS' | 'IPI' | 'OUTROS'
          status?: 'draft' | 'pending' | 'approved' | 'rejected'
          value: number
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          number?: string
          type?: 'PIS' | 'COFINS' | 'ICMS' | 'IPI' | 'OUTROS'
          status?: 'draft' | 'pending' | 'approved' | 'rejected'
          value?: number
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          proposal_id: string
          number: string
          status: 'active' | 'inactive' | 'completed'
          start_date: string
          end_date: string | null
          value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          number?: string
          status?: 'active' | 'inactive' | 'completed'
          start_date: string
          end_date?: string | null
          value: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          number?: string
          status?: 'active' | 'inactive' | 'completed'
          start_date?: string
          end_date?: string | null
          value?: number
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          entity: string
          entity_id: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity: string
          entity_id: string
          details: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity?: string
          entity_id?: string
          details?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 