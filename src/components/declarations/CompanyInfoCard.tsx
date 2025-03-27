
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeclarationDetails } from '@/types/declarations';

interface CompanyInfoCardProps {
  declaration: DeclarationDetails;
}

const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({ declaration }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Razão Social</p>
            <p>{declaration.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">CNPJ</p>
            <p>{declaration.cnpj}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;
