import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useProposals } from '@/hooks/useProposals';
import { useClients } from '@/hooks/useClients';
import { useAuth } from '@/hooks/useAuth';
import { CreateProposalData } from '@/types/proposal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NewProposal() {
  const router = useRouter();
  const { user } = useAuth();
  const { createProposal } = useProposals();
  const { clients } = useClients({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    totalValue: '',
    validUntil: '',
    details: {
      estimatedValue: '',
      description: '',
      periodStart: '',
      periodEnd: '',
      additionalNotes: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      const data: CreateProposalData = {
        title: formData.title,
        description: formData.description,
        clientId: formData.clientId,
        salesRepId: user.id,
        totalValue: parseFloat(formData.totalValue),
        validUntil: formData.validUntil,
        details: {
          estimatedValue: parseFloat(formData.details.estimatedValue),
          description: formData.details.description,
          periodStart: formData.details.periodStart,
          periodEnd: formData.details.periodEnd,
          additionalNotes: formData.details.additionalNotes
        },
        client: clients.find(client => client.id === formData.clientId) || {
          id: '',
          razao_social: '',
          cnpj: ''
        }
      };

      await createProposal(data);
      router.push('/proposals');
    } catch (error) {
      toast.error('Erro ao criar proposta');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Nova Proposta</h1>
        <Button onClick={() => router.push('/proposals')}>
          Voltar para lista
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <Select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.razao_social}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor Total</label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalValue}
                  onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Válido até</label>
                <Input
                  required
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detalhes do Serviço</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Valor Estimado</label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.details.estimatedValue}
                  onChange={(e) => setFormData({
                    ...formData,
                    details: { ...formData.details, estimatedValue: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição do Serviço</label>
                <Textarea
                  required
                  value={formData.details.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    details: { ...formData.details, description: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data Início</label>
                <Input
                  required
                  type="date"
                  value={formData.details.periodStart}
                  onChange={(e) => setFormData({
                    ...formData,
                    details: { ...formData.details, periodStart: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data Fim</label>
                <Input
                  required
                  type="date"
                  value={formData.details.periodEnd}
                  onChange={(e) => setFormData({
                    ...formData,
                    details: { ...formData.details, periodEnd: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Observações Adicionais</label>
                <Textarea
                  value={formData.details.additionalNotes}
                  onChange={(e) => setFormData({
                    ...formData,
                    details: { ...formData.details, additionalNotes: e.target.value }
                  })}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button type="submit">
            Criar Proposta
          </Button>
              </div>
            </form>
    </div>
  );
} 