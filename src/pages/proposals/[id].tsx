import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchProposals, updateProposalStatus } from '@/services/proposalService';
import { Proposal } from '@/types/proposal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { useProposal } from '@/hooks/useProposal';
import { ProposalStatus, PROPOSAL_STATUS_LABELS, PROPOSAL_STATUS_COLORS } from '@/types/proposal';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/lib/format';

const proposalSchema = z.object({
  details: z.object({
    estimatedValue: z.number().min(0, 'O valor estimado deve ser maior que zero'),
    description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres')
  }),
  status: z.enum(['DRAFT', 'ANALYSIS', 'APPROVED', 'REJECTED', 'CONVERTED'] as const)
});

export default function ProposalDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const {
    proposal,
    isLoading,
    error,
    updateStatus
  } = useProposal(id as string);

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar proposta');
      router.push('/proposals');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Proposta não encontrada</h1>
        <Button onClick={() => router.push('/proposals')}>
          Voltar para lista
        </Button>
      </div>
    );
  }

  const handleStatusUpdate = async (status: ProposalStatus, comments?: string) => {
    try {
      await updateStatus(status, comments);
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{proposal.title}</h1>
        <Button onClick={() => router.push('/proposals')}>
          Voltar para lista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
          <div className="space-y-2">
            <p><strong>Razão Social:</strong> {proposal.client.razao_social}</p>
            <p><strong>CNPJ:</strong> {proposal.client.cnpj}</p>
            <p><strong>Email:</strong> {proposal.client.email}</p>
            <p><strong>Telefone:</strong> {proposal.client.phone}</p>
            <p><strong>Endereço:</strong> {proposal.client.address}</p>
                </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Detalhes da Proposta</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> <Badge>{proposal.status}</Badge></p>
            <p><strong>Valor Total:</strong> {formatCurrency(proposal.totalValue)}</p>
            <p><strong>Válido até:</strong> {format(new Date(proposal.validUntil), 'dd/MM/yyyy', { locale: ptBR })}</p>
            <p><strong>Descrição:</strong> {proposal.description}</p>
                </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Serviços</h2>
          <div className="space-y-4">
              <div>
              <p><strong>Valor Estimado:</strong> {formatCurrency(proposal.details.estimatedValue)}</p>
              <p><strong>Descrição:</strong> {proposal.details.description}</p>
              <p><strong>Período:</strong> {format(new Date(proposal.details.periodStart), 'dd/MM/yyyy', { locale: ptBR })} até {format(new Date(proposal.details.periodEnd), 'dd/MM/yyyy', { locale: ptBR })}</p>
              {proposal.details.additionalNotes && (
                <p><strong>Observações:</strong> {proposal.details.additionalNotes}</p>
              )}
              </div>
              </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Linha do Tempo</h2>
          <div className="space-y-4">
            {proposal.timeline.map((event) => (
              <div key={event.id} className="border-l-2 border-gray-200 pl-4">
                <Badge className="mb-2">{event.status}</Badge>
                <p className="text-sm text-gray-500">
                  {format(new Date(event.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
                {event.comments && (
                  <p className="mt-1">{event.comments}</p>
                )}
              </div>
            ))}
                </div>
          </Card>
        </div>

      <div className="mt-8 flex gap-4">
        {proposal.status === 'DRAFT' && (
          <Button onClick={() => handleStatusUpdate('PENDING')}>
            Enviar para análise
          </Button>
        )}

        {proposal.status === 'PENDING' && (
          <>
            <Button onClick={() => handleStatusUpdate('APPROVED')}>
              Aprovar
                      </Button>
            <Button variant="destructive" onClick={() => handleStatusUpdate('REJECTED')}>
              Rejeitar
                      </Button>
                </>
              )}

        {proposal.status !== 'CANCELLED' && (
          <Button variant="destructive" onClick={() => handleStatusUpdate('CANCELLED')}>
            Cancelar
                </Button>
              )}
      </div>
    </div>
  );
} 