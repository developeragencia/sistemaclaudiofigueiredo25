import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { useToast } from '@/components/ui/use-toast';
import { Client } from '@/types/user';
import { toast } from 'sonner';
import { ClientFilters, CreateClientData, UpdateClientData } from '@/types/client';

interface UseClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'pending';
  type?: 'public' | 'private';
  enabled?: boolean;
  assignedOnly?: boolean;
  salesRepOnly?: boolean;
}

export function useClients(filters: ClientFilters = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientService.listClients(filters)
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateClientData) => clientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente criado com sucesso');
    },
    onError: (error) => {
      console.error('Error creating client:', error);
      toast.error('Erro ao criar cliente');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente atualizado com sucesso');
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast.error('Erro ao atualizar cliente');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente excluído com sucesso');
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
    }
  });

  return {
    clients: data?.clients || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    isLoading,
    error,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientService.getClientById(id),
    enabled: !!id,
  });
}

export function useAssignUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: Parameters<typeof clientService.assignUser>[1] }) =>
      clientService.assignUser(clientId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.setQueryData(['clients', data.id], data);
      toast({
        title: 'Usuário atribuído',
        description: 'O usuário foi atribuído ao cliente com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atribuir usuário',
        description: error.message || 'Ocorreu um erro ao atribuir o usuário ao cliente.',
      });
    },
  });
}

export function useUnassignUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ clientId, userId }: { clientId: string; userId: string }) =>
      clientService.unassignUser(clientId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.setQueryData(['clients', data.id], data);
      toast({
        title: 'Usuário removido',
        description: 'O usuário foi removido do cliente com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover usuário',
        description: error.message || 'Ocorreu um erro ao remover o usuário do cliente.',
      });
    },
  });
}

export function useValidateCNPJ() {
  return useMutation({
    mutationFn: clientService.validateCNPJ,
  });
}

export function useImportClients() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: clientService.importClients,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Clientes importados',
        description: 'Os clientes foram importados com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar clientes',
        description: error.message || 'Ocorreu um erro ao importar os clientes.',
      });
    },
  });
}

export function useExportClients() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: clientService.exportClients,
    onSuccess: (data) => {
      // Cria um link para download do arquivo
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clients.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Clientes exportados',
        description: 'Os clientes foram exportados com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao exportar clientes',
        description: error.message || 'Ocorreu um erro ao exportar os clientes.',
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente excluído com sucesso');
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
    }
  });
} 