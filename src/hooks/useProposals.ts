import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalService } from '@/services/proposals';
import { Proposal, ProposalFilters, ProposalStatus } from '@/types/proposal';
import { toast } from 'sonner';
import { CreateProposalData, UpdateProposalData } from '@/types/proposal';

interface UseProposalsParams extends ProposalFilters {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

// Define the correct type for attachment params
interface DownloadAttachmentParams {
  proposalId: string;
  attachmentId: string;
}

export function useProposals(filters: ProposalFilters = {}) {
  const queryClient = useQueryClient();
  return {
    ...useQuery({
      queryKey: ['proposals', filters],
      queryFn: () => proposalService.listProposals(filters)
    }),
    createProposal: useMutation({
      mutationFn: (data: CreateProposalData) => proposalService.createProposal(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['proposals'] });
        toast.success('Proposta criada com sucesso');
      }
    }).mutate,
    updateProposal: useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateProposalData }) => 
        proposalService.updateProposal(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['proposals'] });
        toast.success('Proposta atualizada com sucesso');
      }
    }).mutate,
    deleteProposal: useMutation({
      mutationFn: (id: string) => proposalService.deleteProposal(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['proposals'] });
        toast.success('Proposta excluída com sucesso');
      }
    }).mutate
  };
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: ['proposals', id],
    queryFn: () => proposalService.getProposal(id),
    enabled: !!id
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalService.createProposal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposta criada com sucesso', {
        description: `A proposta "${data.title}" foi criada com sucesso.`,
      });
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
    mutationFn: proposalService.updateProposal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', data.id] });
      toast.success('Proposta atualizada com sucesso', {
        description: `A proposta "${data.title}" foi atualizada com sucesso.`,
      });
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
    mutationFn: proposalService.updateProposalStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', data.id] });
      toast.success('Status atualizado com sucesso', {
        description: `O status da proposta "${data.title}" foi atualizado com sucesso.`,
      });
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
    mutationFn: proposalService.deleteProposal,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.removeQueries({ queryKey: ['proposal', id] });
      toast.success('Proposta excluída com sucesso', {
        description: 'A proposta foi excluída com sucesso.',
      });
    },
    onError: (error) => {
      toast.error('Erro ao excluir proposta', {
        description: 'Ocorreu um erro ao excluir a proposta. Tente novamente.',
      });
    },
  });
}

export function useConvertToContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalService.convertToContract,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', data.id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Proposta convertida em contrato', {
        description: `A proposta "${data.title}" foi convertida em contrato com sucesso.`,
      });
    },
    onError: (error) => {
      toast.error('Erro ao converter proposta', {
        description: 'Ocorreu um erro ao converter a proposta em contrato. Tente novamente.',
      });
    },
  });
}

export function useDownloadAttachment() {
  const downloadAttachment = async (params: DownloadAttachmentParams) => {
    return proposalService.downloadAttachment(params.proposalId, params.attachmentId);
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
