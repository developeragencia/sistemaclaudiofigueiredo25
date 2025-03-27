import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClients } from '@/hooks/useClients';
import { useAuth } from '@/hooks/useAuth';
import { useCreateProposal, useUpdateProposal } from '@/hooks/useProposals';
import { toast } from 'sonner';

const proposalSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  clientId: z.string().min(1, 'O cliente é obrigatório'),
  totalValue: z.number().min(0.01, 'O valor total deve ser maior que zero'),
  validUntil: z.date().min(new Date(), 'A data de validade deve ser futura'),
  attachments: z.array(z.object({
    file: z.instanceof(File),
    name: z.string(),
  })).optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalFormProps {
  proposal?: {
    id: string;
    title: string;
    description: string;
    clientId: string;
    totalValue: number;
    validUntil: string;
  };
  onSuccess?: () => void;
  className?: string;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  proposal,
  onSuccess,
  className,
}) => {
  const { user } = useAuth();
  const { data: clients, isLoading: isLoadingClients } = useClients({
    enabled: user?.role !== 'CLIENT',
    assignedOnly: user?.role === 'SALES_REP',
  });

  const { mutate: createProposal, isLoading: isCreating } = useCreateProposal();
  const { mutate: updateProposal, isLoading: isUpdating } = useUpdateProposal();

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: proposal
      ? {
          ...proposal,
          validUntil: new Date(proposal.validUntil),
          attachments: [],
        }
      : {
          title: '',
          description: '',
          clientId: '',
          totalValue: 0,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          attachments: [],
        },
  });

  const onSubmit = async (data: ProposalFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('clientId', data.clientId);
    formData.append('totalValue', data.totalValue.toString());
    formData.append('validUntil', format(data.validUntil, 'yyyy-MM-dd'));

    if (data.attachments) {
      data.attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}]`, attachment.file);
      });
    }

    if (proposal) {
      updateProposal(
        { proposalId: proposal.id, data: formData },
        {
          onSuccess: () => {
            toast.success('Proposta atualizada com sucesso');
            onSuccess?.();
          },
          onError: () => {
            toast.error('Erro ao atualizar proposta');
          },
        }
      );
    } else {
      createProposal(
        { data: formData },
        {
          onSuccess: () => {
            toast.success('Proposta criada com sucesso');
            onSuccess?.();
          },
          onError: () => {
            toast.error('Erro ao criar proposta');
          },
        }
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentAttachments = form.getValues('attachments') || [];

    const newAttachments = files.map((file) => ({
      file,
      name: file.name,
    }));

    form.setValue('attachments', [...currentAttachments, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    const currentAttachments = form.getValues('attachments') || [];
    const newAttachments = currentAttachments.filter((_, i) => i !== index);
    form.setValue('attachments', newAttachments);
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título da proposta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite a descrição detalhada da proposta"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingClients}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.razaoSocial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Total</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="validUntil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Validade</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Anexos</FormLabel>
          <div className="mt-2 space-y-2">
            {form.watch('attachments')?.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span className="text-sm truncate">{attachment.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Anexo
              </Button>
              <Input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {proposal ? 'Atualizar Proposta' : 'Criar Proposta'}
        </Button>
      </form>
    </Form>
  );
};

export default ProposalForm; 