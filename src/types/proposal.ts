import { User, Client } from './user';
import { Client as ClientType } from './client';

export type ProposalStatus = 'PENDING' | 'ANALYZING' | 'APPROVED' | 'REJECTED' | 'CONVERTED';

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  PENDING: 'Aguardando análise',
  ANALYZING: 'Em análise',
  APPROVED: 'Aprovada',
  REJECTED: 'Rejeitada',
  CONVERTED: 'Convertida em contrato'
};

export interface ProposalTimeline {
  id: string;
  proposalId: string;
  status?: ProposalStatus;
  comment?: string;
  userId: string;
  userName?: string;
  description?: string;
  type?: string;
  metadata?: any;
  createdAt: string;
}

export interface ProposalTimelineEvent {
  id: string;
  type: 'CREATED' | 'UPDATED' | 'ANALYZED' | 'APPROVED' | 'REJECTED' | 'CONVERTED';
  description: string;
  userName: string;
  metadata?: any;
  createdAt: string;
}

export interface ProposalService {
  id: string;
  name: string;
  description: string;
  value: number;
  recurrence: 'one_time' | 'monthly' | 'yearly';
}

export interface Proposal {
  id: string;
  client_id: string;
  title: string;
  description: string;
  value: number;
  status: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
}

export interface ProposalDetails {
  estimatedValue: number;
  periodStart: Date;
  periodEnd: Date;
  serviceDescription: string;
  additionalNotes?: string;
  attachments?: string[]; // URLs dos anexos
}

export interface ProposalEvent {
  id: string;
  proposalId: string;
  type: 'STATUS_CHANGE' | 'COMMENT' | 'DOCUMENT_ADDED';
  description: string;
  userId: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface Contract extends Omit<Proposal, 'status' | 'contractId'> {
  id: string;
  proposalId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  startDate: Date;
  endDate: Date;
  value: number;
  paymentTerms: string;
  documents: ContractDocument[];
}

export interface ContractDocument {
    id: string;
  contractId: string;
  type: 'CONTRACT' | 'AMENDMENT' | 'ATTACHMENT';
    name: string;
    url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ProposalFilters {
  search?: string;
  client_id?: string;
  status?: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED';
  page?: number;
  limit?: number;
  created_at?: {
    gte?: string;
    lte?: string;
  };
}

export interface ProposalResponse {
  items: Proposal[];
  total: number;
  page: number;
  limit: number;
}

// Tipos para análise automática de créditos
export interface CreditAnalysis {
  id: string;
  clientId: string;
  period: {
    start: string;
    end: string;
  };
  transactions: CreditTransaction[];
  summary: {
    totalCredits: number;
    totalRetentions: number;
    potentialCredits: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  date: string;
  supplier: {
    id: string;
    name: string;
    cnpj: string;
    retentionType: 'full' | 'partial' | 'exempt';
    retentionReason?: string;
  };
  value: number;
  retentionValue: number;
  retentionRules: {
    ruleId: string;
    description: string;
    appliedValue: number;
  }[];
  status: 'identified' | 'pending_review' | 'approved' | 'rejected';
  observations?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface CreateProposalData {
  client_id: string;
  title: string;
  description: string;
  value: number;
}

export interface UpdateProposalData {
  title?: string;
  description?: string;
  value?: number;
  status?: 'DRAFT' | 'ANALYSIS' | 'APPROVED' | 'REJECTED';
}

export interface ProposalFormData {
  id?: string;
  title: string;
  description: string;
  clientId: string;
  totalValue: number;
  validUntil: string;
}

export interface Proposal extends ProposalFormData {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  client: {
    id: string;
    razaoSocial: string;
  };
}
