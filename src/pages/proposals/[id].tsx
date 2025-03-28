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
import { useProposal, useProposals } from '@/hooks/useProposals';
import { ProposalStatus, PROPOSAL_STATUS_LABELS, PROPOSAL_STATUS_COLORS } from '@/types/proposal';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/lib/format';
import { ProposalForm } from '@/components/proposals/ProposalForm';
import type { UpdateProposalData } from '@/types/proposal';
import { ProposalTimeline } from '@/components/proposals/ProposalTimeline';
import { ProposalActions } from '@/components/proposals/ProposalActions';

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
  const { data: proposal, isLoading } = useProposal(id as string);
  const { updateProposal } = useProposals();

  const handleSubmit = async (data: UpdateProposalData) => {
    await updateProposal(id as string, data);
    router.push('/proposals');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500">Proposta não encontrada</p>
            <Button
              onClick={() => router.push('/proposals')}
              className="mt-4"
            >
              Voltar para lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{proposal.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant="outline"
              className={PROPOSAL_STATUS_COLORS[proposal.status]}
            >
              {PROPOSAL_STATUS_LABELS[proposal.status]}
            </Badge>
            <span className="text-sm text-gray-500">
              Criada em {format(new Date(proposal.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>
        <Button onClick={() => router.push('/proposals')}>
          Voltar para lista
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Editar Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              <ProposalForm
                proposal={proposal}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/proposals')}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p>{proposal.client.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CNPJ</p>
                <p>{proposal.client.cnpj}</p>
              </div>
            </CardContent>
          </Card>

          <ProposalActions
            proposalId={proposal.id}
            status={proposal.status}
          />

          <ProposalTimeline timeline={proposal.timeline} />
        </div>
      </div>
    </div>
  );
} 