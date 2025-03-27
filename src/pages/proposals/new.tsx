import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createProposal } from '@/services/proposalService';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useActiveClient } from '@/contexts/ActiveClientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const proposalSchema = z.object({
  clientCNPJ: z.string().min(14, 'CNPJ inválido'),
  clientName: z.string().min(3, 'Nome do cliente é obrigatório'),
  estimatedValue: z.string().min(1, 'Valor estimado é obrigatório'),
  periodStart: z.string().min(1, 'Data inicial é obrigatória'),
  periodEnd: z.string().min(1, 'Data final é obrigatória'),
  serviceDescription: z.string().min(10, 'Descrição do serviço é obrigatória'),
  additionalNotes: z.string().optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export function NewProposal() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { client: activeClient } = useActiveClient();

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientCNPJ: activeClient?.cnpj || '',
      clientName: activeClient?.corporateName || '',
      estimatedValue: '',
      periodStart: '',
      periodEnd: '',
      serviceDescription: '',
      additionalNotes: '',
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: (data: ProposalFormData) =>
      createProposal({
        clientCNPJ: data.clientCNPJ,
        clientName: data.clientName,
        salesRepId: 'current-user-id', // TODO: Get from auth context
        details: {
          estimatedValue: parseFloat(data.estimatedValue),
          periodStart: new Date(data.periodStart),
          periodEnd: new Date(data.periodEnd),
          serviceDescription: data.serviceDescription,
          additionalNotes: data.additionalNotes,
        },
      }),
    onSuccess: () => {
      toast({
        title: 'Proposta criada com sucesso!',
        description: 'Você será redirecionado para a lista de propostas.',
      });
      navigate('/proposals');
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar proposta',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProposalFormData) => {
    createProposalMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Proposta Comercial</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cliente</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!!activeClient} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientCNPJ"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!!activeClient} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="estimatedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Estimado (R$)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="periodStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período Inicial</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="periodEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período Final</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Serviço</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Adicionais</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/proposals')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createProposalMutation.isPending}
                >
                  {createProposalMutation.isPending ? 'Criando...' : 'Criar Proposta'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 