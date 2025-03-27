'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Edit } from 'lucide-react';
import ProposalDetails from '@/components/proposals/ProposalDetails';
import ProposalForm from '@/components/proposals/ProposalForm';
import { useProposal } from '@/hooks/useProposals';
import { useAuth } from '@/hooks/useAuth';

export default function ProposalPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const { data: proposal, isLoading } = useProposal(params.id as string);

  const canEditProposal = ['MASTER_ADMIN', 'OFFICE_TEAM', 'SALES_REP'].includes(user?.role || '') &&
    proposal?.status === 'DRAFT';

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detalhes da Proposta</h1>
        </div>
        {canEditProposal && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar Proposta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Proposta</DialogTitle>
              </DialogHeader>
              <ProposalForm
                proposal={proposal}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  router.refresh();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ProposalDetails
        proposalId={params.id as string}
      />
    </div>
  );
} 