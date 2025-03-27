import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, Notification } from '@/services/userService';
import { useToast } from '@/components/ui/use-toast';

interface UseNotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export function useNotifications({
  page = 1,
  limit = 10,
  unreadOnly = false,
}: UseNotificationsParams = {}) {
  return useQuery({
    queryKey: ['notifications', { page, limit, unreadOnly }],
    queryFn: () => userService.getNotifications({ page, limit, unreadOnly }),
    staleTime: 1000 * 60, // 1 minuto
    refetchInterval: 1000 * 30, // Refetch a cada 30 segundos
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userService.markNotificationAsRead,
    onMutate: async (notificationId) => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot do estado anterior
      const previousNotifications = queryClient.getQueryData(['notifications']);

      // Otimisticamente atualiza a notificação como lida
      queryClient.setQueryData(['notifications'], (old: any) => ({
        ...old,
        data: old.data.map((notification: Notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, old.unreadCount - 1),
      }));

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      // Reverte para o estado anterior em caso de erro
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
      toast({
        variant: "destructive",
        title: "Erro ao marcar notificação como lida",
        description: "Ocorreu um erro ao marcar a notificação como lida.",
      });
    },
    onSettled: () => {
      // Revalida os dados
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userService.markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData(['notifications']);

      // Otimisticamente marca todas como lidas
      queryClient.setQueryData(['notifications'], (old: any) => ({
        ...old,
        data: old.data.map((notification: Notification) => ({
          ...notification,
          read: true,
        })),
        unreadCount: 0,
      }));

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
      toast({
        variant: "destructive",
        title: "Erro ao marcar notificações como lidas",
        description: "Ocorreu um erro ao marcar todas as notificações como lidas.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Notificações marcadas como lidas",
        description: "Todas as notificações foram marcadas como lidas.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userService.deleteNotification,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData(['notifications']);

      // Otimisticamente remove a notificação
      queryClient.setQueryData(['notifications'], (old: any) => ({
        ...old,
        data: old.data.filter((n: Notification) => n.id !== notificationId),
        total: old.total - 1,
        unreadCount: old.unreadCount - (old.data.find((n: Notification) => n.id === notificationId)?.read ? 0 : 1),
      }));

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
      toast({
        variant: "destructive",
        title: "Erro ao deletar notificação",
        description: "Ocorreu um erro ao deletar a notificação.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Notificação deletada",
        description: "A notificação foi deletada com sucesso.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useEnablePushNotifications() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: userService.enablePushNotifications,
    onSuccess: () => {
      toast({
        title: "Notificações push habilitadas",
        description: "Você receberá notificações push quando houver novidades.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao habilitar notificações push",
        description: error.message || "Ocorreu um erro ao habilitar as notificações push.",
      });
    },
  });
} 