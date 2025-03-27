import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchProposals, updateProposalStatus } from '@/services/proposalService';
import { Proposal } from '@/types/proposal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Timeline, TimelineItem } from '@/components/ui/timeline';

export function ProposalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: proposal, isLoading } = useQuery<Proposal>({
    queryKey: ['proposal', id],
    queryFn: async () => {
      const proposals = await fetchProposals();
      const proposal = proposals.find(p => p.id === id);
      if (!proposal) throw new Error('Proposta não encontrada');
      return proposal;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, userId }: { status: Proposal['status']; userId: string }) =>
      updateProposalStatus(id!, status, userId),
    onSuccess: () => {
      toast({
        title: 'Status atualizado com sucesso!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading || !proposal) {
    return <div>Carregando proposta...</div>;
  }

  const handleStatusUpdate = (newStatus: Proposal['status']) => {
    updateStatusMutation.mutate({
      status: newStatus,
      userId: 'current-user-id', // TODO: Get from auth context
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalhes da Proposta</h1>
        <Button variant="outline" onClick={() => navigate('/proposals')}>
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Proposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Cliente</h3>
                  <p>{proposal.clientName}</p>
                </div>
                <div>
                  <h3 className="font-medium">CNPJ</h3>
                  <p>{proposal.clientCNPJ}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Status</h3>
                <Badge className="mt-1">{proposal.status}</Badge>
              </div>

              <div>
                <h3 className="font-medium">Valor Estimado</h3>
                <p>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(proposal.details.estimatedValue)}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Período</h3>
                <p>
                  {format(new Date(proposal.details.periodStart), "dd/MM/yyyy")} até{' '}
                  {format(new Date(proposal.details.periodEnd), "dd/MM/yyyy")}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Descrição do Serviço</h3>
                <p className="whitespace-pre-wrap">{proposal.details.serviceDescription}</p>
              </div>

              {proposal.details.additionalNotes && (
                <div>
                  <h3 className="font-medium">Observações Adicionais</h3>
                  <p className="whitespace-pre-wrap">{proposal.details.additionalNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposal.status === 'PENDING' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full">Iniciar Análise</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Iniciar análise da proposta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso indicará que a proposta está em processo de análise.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleStatusUpdate('ANALYZING')}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {proposal.status === 'ANALYZING' && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" variant="default">
                        Aprovar Proposta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Aprovar proposta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A proposta será marcada como aprovada e poderá ser convertida em contrato.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleStatusUpdate('APPROVED')}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" variant="destructive">
                        Rejeitar Proposta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Rejeitar proposta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A proposta será marcada como rejeitada e não poderá ser convertida em contrato.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleStatusUpdate('REJECTED')}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {proposal.status === 'APPROVED' && (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/contracts/new?proposalId=${proposal.id}`)}
                >
                  Converter em Contrato
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline>
                {proposal.timeline.map((event) => (
                  <TimelineItem
                    key={event.id}
                    title={event.description}
                    timestamp={format(
                      new Date(event.createdAt),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  />
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 