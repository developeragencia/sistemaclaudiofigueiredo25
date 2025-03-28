import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useProposals } from '@/hooks/useProposals';
import { ProposalForm } from '@/components/proposals/ProposalForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreateProposalData } from '@/types/proposal';

export default function NewProposal() {
  const router = useRouter();
  const { user } = useAuth();
  const { createProposal } = useProposals();

  const handleSubmit = async (data: CreateProposalData) => {
    if (!user?.id) {
      return;
    }

    await createProposal({
      ...data,
      salesRepId: user.id
    });

    router.push('/proposals');
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nova Proposta</CardTitle>
        </CardHeader>
        <CardContent>
          <ProposalForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/proposals')}
          />
        </CardContent>
      </Card>
    </div>
  );
} 