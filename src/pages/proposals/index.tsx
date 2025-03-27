import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProposals } from '@/services/proposalService';
import { Proposal, ProposalStatus } from '@/types/proposal';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const statusColors: Record<ProposalStatus, string> = {
  PENDING: 'bg-yellow-500',
  ANALYZING: 'bg-blue-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  CONVERTED: 'bg-purple-500',
};

export default function ProposalsPage() {
  const navigate = useNavigate();
  const { data: proposals = [], isLoading } = useQuery<Proposal[]>({
    queryKey: ['proposals'],
    queryFn: () => fetchProposals(),
  });

  const handleCreateProposal = () => {
    navigate('/proposals/new');
  };

  const handleViewProposal = (id: string) => {
    navigate(`/proposals/${id}`);
  };

  if (isLoading) {
    return <div>Carregando propostas...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Propostas Comerciais</h1>
        <Button onClick={handleCreateProposal}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Proposta
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor Estimado</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Representante</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell>{proposal.clientName}</TableCell>
                <TableCell>{proposal.clientCNPJ}</TableCell>
                <TableCell>
                  <Badge className={statusColors[proposal.status]}>
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(proposal.details.estimatedValue)}
                </TableCell>
                <TableCell>
                  {format(new Date(proposal.createdAt), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>{proposal.salesRepId}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleViewProposal(proposal.id)}
                  >
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 