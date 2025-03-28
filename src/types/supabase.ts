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
          cnpj: string
          email: string
          phone: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cnpj: string
          email: string
          phone: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          cnpj?: string
          email?: string
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          title: string
          description: string
          client: {
            id: string
            name: string
            cnpj: string
          }
          total_value: number
          valid_until: string
          status: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED' | 'CONVERTED'
          details: {
            estimatedValue: number
            description: string
            periodStart?: string
            periodEnd?: string
            additionalNotes?: string
            serviceDescription?: string
          }
          timeline: {
            id: string
            status: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED' | 'CONVERTED'
            comments?: string
            updatedAt: string
            updatedBy: string
          }[]
          created_at: string
          updated_at: string
          sales_rep_id?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          client: {
            id: string
            name: string
            cnpj: string
          }
          total_value: number
          valid_until: string
          status: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED' | 'CONVERTED'
          details: {
            estimatedValue: number
            description: string
            periodStart?: string
            periodEnd?: string
            additionalNotes?: string
            serviceDescription?: string
          }
          timeline: {
            id: string
            status: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED' | 'CONVERTED'
            comments?: string
            updatedAt: string
            updatedBy: string
          }[]
          created_at?: string
          updated_at?: string
          sales_rep_id?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          client?: {
            id: string
            name: string
            cnpj: string
          }
          total_value?: number
          valid_until?: string
          status?: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED' | 'CONVERTED'
          details?: {
            estimatedValue: number
            description: string
            periodStart?: string
            periodEnd?: string
            additionalNotes?: string
            serviceDescription?: string
          }
          timeline?: {
            id: string
            status: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED' | 'CONVERTED'
            comments?: string
            updatedAt: string
            updatedBy: string
          }[]
          created_at?: string
          updated_at?: string
          sales_rep_id?: string
        }
      }
      contracts: {
        Row: {
          id: string
          proposal_id: string
          status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED'
          start_date: string
          end_date: string
          value: number
          created_at: string
          updated_at: string
          sales_rep_id: string
        }
        Insert: {
          id?: string
          proposal_id: string
          status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED'
          start_date: string
          end_date: string
          value: number
          created_at?: string
          updated_at?: string
          sales_rep_id: string
        }
        Update: {
          id?: string
          proposal_id?: string
          status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED'
          start_date?: string
          end_date?: string
          value?: number
          created_at?: string
          updated_at?: string
          sales_rep_id?: string
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