import { User } from './user'
import { Json } from './supabase'

export interface Audit {
  id: string;
  title?: string;
  client?: string;
  clientName: string;
  type?: string;
  auditType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignedTo?: string;
  priority?: string;
  description?: string;
  findings?: string;
  recommendations?: string;
  clientId?: string;
  date?: string;
  startDate?: string;
  deadline?: string;
  documentsCount?: number;
  documentNumber?: string;
  documents?: string[];
  completionDate?: string;
  observations?: string;
  notes?: string;
}

export interface AuditSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  inProgress: number;
  // For backward compatibility
  totalAudits: number;
  pendingAudits: number;
  completedAudits: number;
  inProgressAudits: number;
  // Portuguese labels
  emAndamento: number;
  pendentes: number;
  concluidas: number;
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity: string
  entity_id: string
  details: Json
  created_at: string
  user?: Pick<User, 'id' | 'name' | 'email'>
}

export interface AuditLogFilters {
  user_id?: string
  action?: string
  entity?: string
  entity_id?: string
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export interface AuditLogResponse {
  logs: AuditLog[]
  total: number
  page: number
  limit: number
}
