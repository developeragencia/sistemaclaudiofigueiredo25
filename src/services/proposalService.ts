import api from '@/lib/api';
import { Proposal, ProposalFilters, ProposalStatus, ProposalResponse } from '@/types/proposal';
import { supabase } from '@/lib/supabase';
import { ProposalEvent, Contract } from '@/types/proposal';

export interface CreateProposalData {
  clientId: string;
  clientName: string;
  clientCNPJ: string;
  salesRepId: string;
  details: {
    estimatedValue: number;
    description: string;
    periodStart?: Date;
    periodEnd?: Date;
    additionalNotes?: string;
  };
}

export interface UpdateProposalData {
  details?: {
    estimatedValue: number;
    description: string;
    periodStart?: Date;
    periodEnd?: Date;
    additionalNotes?: string;
  };
}

interface GetProposalsParams extends ProposalFilters {
  page?: number;
  limit?: number;
}

interface ProposalsResponse {
  proposals: Proposal[];
  total: number;
  page: number;
  totalPages: number;
}

class ProposalService {
  async getProposals(params?: GetProposalsParams): Promise<ProposalsResponse> {
    try {
      const { data } = await api.get<ProposalsResponse>('/proposals', { params });
      return data;
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
      throw error;
    }
  }

  async getProposal(id: string): Promise<Proposal> {
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select(`
        *,
        timeline:proposal_timeline(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return this.mapProposalFromDB(proposal);
  }

  async createProposal(data: CreateProposalData): Promise<Proposal> {
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        client_id: data.clientId,
        client_name: data.clientName,
        client_cnpj: data.clientCNPJ,
        sales_rep_id: data.salesRepId,
        details: data.details,
        status: 'DRAFT' as ProposalStatus,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapProposalFromDB(proposal);
  }

  async updateProposal(id: string, data: UpdateProposalData): Promise<Proposal> {
    const { data: proposal, error } = await supabase
      .from('proposals')
      .update({
        details: data.details,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapProposalFromDB(proposal);
  }

  async updateStatus(
    id: string,
    status: ProposalStatus,
    userId: string,
    comments?: string
  ): Promise<Proposal> {
    const { data: proposal, error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await supabase
      .from('proposal_timeline')
      .insert({
        proposal_id: id,
        status,
        updated_by: userId,
        comments
      });

    return this.getProposal(id);
  }

  async deleteProposal(id: string): Promise<void> {
    try {
      await api.delete(`/proposals/${id}`);
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      throw error;
    }
  }

  async convertToContract(id: string): Promise<Proposal> {
    try {
      const { data } = await api.post<Proposal>(`/proposals/${id}/convert`);
      return data;
    } catch (error) {
      console.error('Erro ao converter proposta em contrato:', error);
      throw error;
    }
  }

  async downloadAttachment(proposalId: string, attachmentId: string): Promise<Blob> {
    try {
      const { data } = await api.get<Blob>(
        `/proposals/${proposalId}/attachments/${attachmentId}`,
        { responseType: 'blob' }
      );
      return data;
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
      throw error;
    }
  }

  async listProposals(filters: ProposalFilters = {}): Promise<ProposalResponse> {
    let query = supabase
      .from('proposals')
      .select(`
        *,
        timeline:proposal_timeline(*),
        count:count()
      `, { count: 'exact' });

    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters.salesRepId) {
      query = query.eq('sales_rep_id', filters.salesRepId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }

    if (filters.search) {
      query = query.or(`
        client_name.ilike.%${filters.search}%,
        client_cnpj.ilike.%${filters.search}%,
        details->>'description'.ilike.%${filters.search}%
      `);
    }

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      data: data.map(this.mapProposalFromDB),
      total: count || 0
    };
  }

  private mapProposalFromDB(data: any): Proposal {
    return {
      id: data.id,
      clientId: data.client_id,
      clientName: data.client_name,
      clientCNPJ: data.client_cnpj,
      salesRepId: data.sales_rep_id,
      details: data.details,
      status: data.status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      timeline: data.timeline?.map((item: any) => ({
        id: item.id,
        proposalId: item.proposal_id,
        status: item.status,
        updatedBy: item.updated_by,
        updatedAt: new Date(item.updated_at),
        comments: item.comments
      })) || []
    };
  }
}

export const proposalService = new ProposalService();

export async function fetchProposals(filters?: {
  status?: string[];
  clientCNPJ?: string;
  salesRepId?: string;
}): Promise<Proposal[]> {
  let query = supabase
    .from('proposals')
    .select('*, timeline(*)');

  if (filters?.status) {
    query = query.in('status', filters.status);
  }
  if (filters?.clientCNPJ) {
    query = query.eq('clientCNPJ', filters.clientCNPJ);
  }
  if (filters?.salesRepId) {
    query = query.eq('salesRepId', filters.salesRepId);
  }

  const { data, error } = await query.order('createdAt', { ascending: false });

  if (error) {
    throw new Error('Erro ao buscar propostas: ' + error.message);
  }

  return data || [];
}

export async function createProposal(proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<Proposal> {
  const { data, error } = await supabase
    .from('proposals')
    .insert([{
      ...proposal,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao criar proposta: ' + error.message);
  }

  // Criar primeiro evento na timeline
  await createProposalEvent({
    proposalId: data.id,
    type: 'STATUS_CHANGE',
    description: 'Proposta criada',
    userId: proposal.salesRepId,
    metadata: { status: 'PENDING' }
  });

  return data;
}

export async function updateProposalStatus(
  proposalId: string,
  status: Proposal['status'],
  userId: string,
  metadata?: Record<string, any>
): Promise<void> {
  const { error } = await supabase
    .from('proposals')
    .update({
      status,
      updatedAt: new Date().toISOString(),
      ...(status === 'ANALYZING' ? { analyzedBy: userId, analyzedAt: new Date().toISOString() } : {})
    })
    .eq('id', proposalId);

  if (error) {
    throw new Error('Erro ao atualizar status da proposta: ' + error.message);
  }

  // Registrar mudança na timeline
  await createProposalEvent({
    proposalId,
    type: 'STATUS_CHANGE',
    description: `Status alterado para ${status}`,
    userId,
    metadata: { status, ...metadata }
  });
}

export async function createProposalEvent(event: Omit<ProposalEvent, 'id' | 'createdAt'>): Promise<ProposalEvent> {
  const { data, error } = await supabase
    .from('proposal_events')
    .insert([{
      ...event,
      createdAt: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao criar evento na timeline: ' + error.message);
  }

  return data;
}

export async function convertProposalToContract(
  proposalId: string,
  contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Contract> {
  // Criar contrato
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert([{
      ...contractData,
      proposalId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    .select()
    .single();

  if (contractError) {
    throw new Error('Erro ao criar contrato: ' + contractError.message);
  }

  // Atualizar status da proposta
  await updateProposalStatus(proposalId, 'CONVERTED', contractData.salesRepId, {
    contractId: contract.id
  });

  return contract;
}
