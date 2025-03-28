import { useRouter } from 'next/router';
import { useState } from 'react';
import { useProposals } from '@/hooks/useProposals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PROPOSAL_STATUS_LABELS, PROPOSAL_STATUS_COLORS } from '@/types/proposal';
import { formatCurrency } from '@/lib/format';

export default function Proposals() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { proposals, isLoading, total } = useProposals({ search });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Propostas</h1>
          <p className="text-gray-500 mt-1">
            {total} {total === 1 ? 'proposta encontrada' : 'propostas encontradas'}
          </p>
        </div>
        <Button onClick={() => router.push('/proposals/new')}>
          Nova Proposta
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar propostas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      ) : proposals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500">Nenhuma proposta encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/proposals/${proposal.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{proposal.title}</h2>
                  <Badge
                    variant="outline"
                    className={PROPOSAL_STATUS_COLORS[proposal.status]}
                  >
                    {PROPOSAL_STATUS_LABELS[proposal.status]}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Cliente:</span> {proposal.client.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">CNPJ:</span> {proposal.client.cnpj}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Valor Total:</span> {formatCurrency(proposal.totalValue)}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Criada em:</span>{' '}
                    {format(new Date(proposal.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 