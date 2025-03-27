import { Proposal } from './proposal'

export interface Contract {
  id: string
  client_id: string
  proposal_id: string
  number: string
  title: string
  description: string
  value: number
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  proposal?: Omit<Proposal, 'created_at' | 'updated_at'>
}

export interface CreateContractData {
  client_id: string
  proposal_id: string
  title: string
  description: string
  value: number
  start_date: string
  end_date: string
}

export interface UpdateContractData {
  title?: string
  description?: string
  value?: number
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  start_date?: string
  end_date?: string
}

export interface ContractFilters {
  search?: string
  client_id?: string
  proposal_id?: string
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  page?: number
  limit?: number
  created_at?: {
    gte?: string
    lte?: string
  }
}

export interface ContractResponse {
  items: Contract[]
  total: number
  page: number
  limit: number
} 