import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useProposals } from '@/hooks/useProposals';
import { formatCurrency } from '@/lib/format';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Proposals() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const {
    proposals,
    isLoading,
    error
  } = useProposals({
    search
  });

  if (error) {
    toast.error('Erro ao carregar propostas');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Propostas</h1>
        <Button onClick={() => router.push('/proposals/new')}>
          Nova Proposta
        </Button>
      </div>

      <div className="mb-8">
        <Input
          type="text"
          placeholder="Pesquisar propostas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma proposta encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/proposals/${proposal.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{proposal.title}</h2>
                <Badge>{proposal.status}</Badge>
              </div>

              <div className="space-y-2">
                <p><strong>Cliente:</strong> {proposal.client.razao_social}</p>
                <p><strong>CNPJ:</strong> {proposal.client.cnpj}</p>
                <p><strong>Valor Total:</strong> {formatCurrency(proposal.totalValue)}</p>
                <p><strong>Criado em:</strong> {format(new Date(proposal.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 