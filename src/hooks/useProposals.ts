import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import type {
  ProposalResponse,
  ProposalFilters,
  CreateProposalData,
  UpdateProposalData,
  UpdateProposalStatusData,
  Proposal,
  ProposalStatus,
  UseProposalsReturn
} from '@/types/proposal';

export interface UseProposalsProps extends ProposalFilters {}

export function useProposals(filters: ProposalFilters = {}): UseProposalsReturn {
  const queryClient = useQueryClient();

  const {
    data: proposalsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['proposals', filters],
    queryFn: async () => {
      try {
        let query = supabase.from('proposals').select('*');

        if (filters.clientId) {
          query = query.eq('client_id', filters.clientId);
        }

        if (filters.salesRepId) {
          query = query.eq('sales_rep_id', filters.salesRepId);
        }

        if (filters.status) {
          query = query.eq('status', filters.status);
        }

        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate);
        }

        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate);
        }

        if (filters.page && filters.limit) {
          const from = (filters.page - 1) * filters.limit;
          const to = from + filters.limit - 1;
          query = query.range(from, to);
        }

        const { data, error: queryError, count } = await query;

        if (queryError) {
          throw queryError;
        }

  return {
          proposals: data || [],
          total: count || 0,
          page: filters.page || 1,
          limit: filters.limit || 10
        };
      } catch (error) {
        console.error('Error fetching proposals:', error);
        throw error;
      }
    }
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: CreateProposalData) => {
      const { error } = await supabase.from('proposals').insert({
        title: data.title,
        description: data.description,
        client_id: data.clientId,
        sales_rep_id: data.salesRepId,
        total_value: data.totalValue,
        valid_until: data.validUntil,
        status: 'DRAFT',
        details: data.details,
        timeline: [{
          id: crypto.randomUUID(),
          status: 'DRAFT',
          updatedAt: new Date().toISOString(),
          updatedBy: data.salesRepId
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (error) {
        throw error;
      }

      toast.success('Proposta criada com sucesso!');
    },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (error) => {
      console.error('Error creating proposal:', error);
      toast.error('Erro ao criar proposta. Tente novamente.');
    }
  });

  const updateProposalMutation = useMutation({
    mutationFn: async ({ id, updateData }: { id: string; updateData: UpdateProposalData }) => {
      const dataToUpdate: Record<string, any> = {
        updated_at: new Date().toISOString()
      };

      if (updateData.title) {
        dataToUpdate.title = updateData.title;
      }

      if (updateData.description) {
        dataToUpdate.description = updateData.description;
      }

      if (updateData.totalValue) {
        dataToUpdate.total_value = updateData.totalValue;
      }

      if (updateData.validUntil) {
        dataToUpdate.valid_until = updateData.validUntil;
      }

      if (updateData.details) {
        dataToUpdate.details = updateData.details;
      }

      const { error } = await supabase
        .from('proposals')
        .update(dataToUpdate)
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Proposta atualizada com sucesso!');
    },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (error) => {
      console.error('Error updating proposal:', error);
      toast.error('Erro ao atualizar proposta. Tente novamente.');
    }
  });

  const deleteProposalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Proposta excluída com sucesso!');
    },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (error) => {
      console.error('Error deleting proposal:', error);
      toast.error('Erro ao excluir proposta. Tente novamente.');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProposalStatusData }) => {
      const proposal = await supabase
        .from('proposals')
        .select('timeline')
        .eq('id', id)
        .single();

      if (proposal.error) {
        throw proposal.error;
      }

      const timeline = [...(proposal.data.timeline || []), {
        id: crypto.randomUUID(),
        status: data.status,
        comments: data.comments,
        updatedAt: new Date().toISOString(),
        updatedBy: (await supabase.auth.getUser()).data.user?.id || ''
      }];

      const { error } = await supabase
        .from('proposals')
        .update({
          status: data.status,
          timeline,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Status da proposta atualizado com sucesso!');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (error) => {
      console.error('Error updating proposal status:', error);
      toast.error('Erro ao atualizar status da proposta. Tente novamente.');
    }
  });

  return {
    proposals: proposalsData?.proposals || [],
    isLoading,
    error,
    total: proposalsData?.total || 0,
    page: proposalsData?.page || 1,
    limit: proposalsData?.limit || 10,
    createProposal: (data: CreateProposalData) => createProposalMutation.mutateAsync(data),
    updateProposal: (id: string, data: UpdateProposalData) => updateProposalMutation.mutateAsync({ id, updateData: data }),
    deleteProposal: (id: string) => deleteProposalMutation.mutateAsync(id),
    updateStatus: (id: string, data: UpdateProposalStatusData) => updateStatusMutation.mutateAsync({ id, data })
  };
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: ['proposals', id],
    queryFn: () => supabase.from('proposals').select('*').eq('id', id),
    enabled: !!id
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProposalData) => {
      const { error } = await supabase.from('proposals').insert({
        client_id: data.client.id,
        title: data.title,
        description: data.description,
        total_value: data.totalValue,
        valid_until: data.validUntil.toISOString(),
        service_description: data.details.serviceDescription,
        period_start: data.details.periodStart?.toISOString(),
        period_end: data.details.periodEnd?.toISOString(),
        additional_notes: data.details.additionalNotes,
        status: 'DRAFT',
        timeline: [{
          id: crypto.randomUUID(),
          status: 'DRAFT',
          updatedAt: new Date().toISOString(),
          updatedBy: 'system',
          comments: 'Proposta criada',
        }],
      });

      if (error) {
        logger.error('Erro ao criar proposta', { error });
        throw new Error('Erro ao criar proposta');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposta criada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar proposta', {
        description: 'Ocorreu um erro ao criar a proposta. Tente novamente.',
      });
    },
  });
}

export function useUpdateProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateProposalData) => {
      const { error } = await supabase
        .from('proposals')
        .update({
          title: data.title,
          description: data.description,
          total_value: data.totalValue,
          valid_until: data.validUntil?.toISOString(),
          service_description: data.details?.serviceDescription,
          period_start: data.details?.periodStart?.toISOString(),
          period_end: data.details?.periodEnd?.toISOString(),
          additional_notes: data.details?.additionalNotes,
        })
        .eq('id', data.id);

      if (error) {
        logger.error('Erro ao atualizar proposta', { error });
        throw new Error('Erro ao atualizar proposta');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', data.id] });
      toast.success('Proposta atualizada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar proposta', {
        description: 'Ocorreu um erro ao atualizar a proposta. Tente novamente.',
      });
    },
  });
}

export function useUpdateProposalStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateProposalStatusData) => {
      const timelineEntry = {
        id: crypto.randomUUID(),
        status: data.status,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
        comments: data.comments,
      };

      const { error } = await supabase
        .from('proposals')
        .update({
          status: data.status,
          timeline: supabase.raw('timeline || ?::jsonb', [JSON.stringify([timelineEntry])]),
        })
        .eq('id', data.id);

      if (error) {
        logger.error('Erro ao atualizar status da proposta', { error });
        throw new Error('Erro ao atualizar status da proposta');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', data.id] });
      toast.success('Status atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status', {
        description: 'Ocorreu um erro ao atualizar o status da proposta. Tente novamente.',
      });
    },
  });
}

export function useDeleteProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Erro ao excluir proposta', { error });
        throw new Error('Erro ao excluir proposta');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useConvertToContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Proposal) => {
      const { error } = await supabase
        .from('proposals')
        .update({
          status: 'CONTRACT',
        })
        .eq('id', data.id);

      if (error) {
        logger.error('Erro ao converter proposta', { error });
        throw new Error('Erro ao converter proposta');
      }

      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', data.id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Proposta convertida em contrato');
    },
    onError: (error) => {
      toast.error('Erro ao converter proposta', {
        description: 'Ocorreu um erro ao converter a proposta em contrato. Tente novamente.',
      });
    },
  });
}

export function useDownloadAttachment() {
  const downloadAttachment = async (params: { proposalId: string; attachmentId: string }) => {
    return supabase.storage.from('attachments').download(params.attachmentId);
  };
  
  return useMutation({
    mutationFn: downloadAttachment,
    onSuccess: (data) => {
      // Cria um URL para o blob e força o download
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attachment`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error('Erro ao baixar anexo', {
        description: 'Ocorreu um erro ao baixar o anexo. Tente novamente.',
      });
    },
  });
}
