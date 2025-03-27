import api from '@/lib/api';
import { Proposal, ProposalFilters, ProposalStatus } from '@/types/proposal';
import { supabase } from '@/lib/supabase';
import { ProposalEvent, Contract } from '@/types/proposal';

interface CreateProposalData {
  title: string;
  clientId: string;
  description: string;
  services: {
    name: string;
    description: string;
    value: number;
    recurrence: 'one_time' | 'monthly' | 'yearly';
  }[];
  validUntil: string;
  attachments?: File[];
}

interface UpdateProposalData extends Partial<CreateProposalData> {
  id: string;
}

interface UpdateProposalStatusData {
  id: string;
  status: ProposalStatus;
  comment?: string;
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

export const proposalService = {
  async getProposals(params?: GetProposalsParams): Promise<ProposalsResponse> {
    try {
      const { data } = await api.get<ProposalsResponse>('/proposals', { params });
      return data;
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
      throw error;
    }
  },

  async getProposalById(id: string): Promise<Proposal> {
    try {
      const { data } = await api.get<Proposal>(`/proposals/${id}`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar proposta:', error);
      throw error;
    }
  },

  async createProposal(data: CreateProposalData): Promise<Proposal> {
    try {
      const formData = new FormData();
      
      // Adiciona os dados básicos
      formData.append('data', JSON.stringify({
        title: data.title,
        clientId: data.clientId,
        description: data.description,
        services: data.services,
        validUntil: data.validUntil,
      }));

      // Adiciona os anexos
      if (data.attachments) {
        data.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const { data: response } = await api.post<Proposal>('/proposals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      throw error;
    }
  },

  async updateProposal(data: UpdateProposalData): Promise<Proposal> {
    try {
      const formData = new FormData();
      
      // Adiciona os dados básicos
      formData.append('data', JSON.stringify({
        title: data.title,
        description: data.description,
        services: data.services,
        validUntil: data.validUntil,
      }));

      // Adiciona os anexos
      if (data.attachments) {
        data.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const { data: response } = await api.put<Proposal>(`/proposals/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      throw error;
    }
  },

  async updateProposalStatus(data: UpdateProposalStatusData): Promise<Proposal> {
    try {
      const { data: response } = await api.patch<Proposal>(`/proposals/${data.id}/status`, {
        status: data.status,
        comment: data.comment,
      });

      return response;
    } catch (error) {
      console.error('Erro ao atualizar status da proposta:', error);
      throw error;
    }
  },

  async deleteProposal(id: string): Promise<void> {
    try {
      await api.delete(`/proposals/${id}`);
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      throw error;
    }
  },

  async convertToContract(id: string): Promise<Proposal> {
    try {
      const { data } = await api.post<Proposal>(`/proposals/${id}/convert`);
      return data;
    } catch (error) {
      console.error('Erro ao converter proposta em contrato:', error);
      throw error;
    }
  },

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
  },
};

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
