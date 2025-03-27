'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import ProposalList from '@/components/proposals/ProposalList';
import ProposalFilters from '@/components/proposals/ProposalFilters';
import ProposalForm from '@/components/proposals/ProposalForm';
import { useAuth } from '@/hooks/useAuth';
import { ProposalStatus } from '@/types/proposal';

export default function ProposalsPage() {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<{
    status?: ProposalStatus[];
    clientId?: string;
    salesRepId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }>({});

  const canCreateProposal = ['MASTER_ADMIN', 'OFFICE_TEAM', 'SALES_REP'].includes(user?.role || '');

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Propostas Comerciais</h1>
        {canCreateProposal && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Proposta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Proposta</DialogTitle>
              </DialogHeader>
              <ProposalForm
                onSuccess={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ProposalFilters
        onFilterChange={setFilters}
      />

      <ProposalList
        filters={filters}
      />
    </div>
  )
} 