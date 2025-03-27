
import React from 'react';
import { BookOpen, HardDrive, Building, Shield } from 'lucide-react';

import DashboardHeader from './dashboard/DashboardHeader';
import DashboardSection from './dashboard/DashboardSection';
import StatCards from './dashboard/StatCards';
import { getMainMenuItems } from './dashboard/MainMenuItems';
import { getOperationalMenuItems } from './dashboard/OperationalMenuItems';
import ActiveClientHeader from './client/ActiveClientHeader';
import { useActiveClient } from '@/hooks/useActiveClient';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  // Get menu items from the separate files
  const mainMenuItems = getMainMenuItems();
  const operationalMenuItems = getOperationalMenuItems();
  
  const { 
    activeClient, 
    clients, 
    recentClients, 
    handleSelectClient, 
    hasViewAccess, 
    hasEditAccess, 
    isClientAdmin, 
    isRepresentative 
  } = useActiveClient();

  return (
    <div className="space-y-8">
      {/* Active Client Header */}
      <ActiveClientHeader />
      
      {/* Dashboard header */}
      <DashboardHeader />

      {/* Cards de estatísticas */}
      <StatCards />

      {/* Access cards */}
      {activeClient && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`border-l-4 ${hasViewAccess ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Visualização</CardTitle>
              <CardDescription>
                {hasViewAccess 
                  ? "Você pode visualizar operações deste cliente." 
                  : "Sem acesso para visualizar operações."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={hasViewAccess ? "default" : "outline"}>
                {hasViewAccess ? "Acesso Liberado" : "Sem Acesso"}
              </Badge>
            </CardContent>
          </Card>
          
          <Card className={`border-l-4 ${hasEditAccess ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Edição</CardTitle>
              <CardDescription>
                {hasEditAccess 
                  ? "Você pode editar operações deste cliente." 
                  : "Sem permissão para editar operações."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={hasEditAccess ? "default" : "outline"}>
                {hasEditAccess ? "Acesso Liberado" : "Sem Acesso"}
              </Badge>
            </CardContent>
          </Card>
          
          <Card className={`border-l-4 ${isClientAdmin ? 'border-l-purple-500' : 'border-l-gray-300'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Administração</CardTitle>
              <CardDescription>
                {isClientAdmin 
                  ? "Você é administrador deste cliente." 
                  : "Você não é administrador deste cliente."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={isClientAdmin ? "default" : "outline"}>
                {isClientAdmin ? "Acesso Completo" : "Sem Acesso"}
              </Badge>
            </CardContent>
          </Card>
          
          <Card className={`border-l-4 ${isRepresentative ? 'border-l-amber-500' : 'border-l-gray-300'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Representação</CardTitle>
              <CardDescription>
                {isRepresentative 
                  ? "Você é representante comercial deste cliente." 
                  : "Você não é representante deste cliente."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={isRepresentative ? "default" : "outline"}>
                {isRepresentative ? "Representante" : "Não Representante"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Menu principal */}
      <DashboardSection 
        title="Módulos Principais"
        icon={<BookOpen className="mr-2 h-5 w-5 text-primary" />}
        items={mainMenuItems}
      />

      {/* Menu operacional */}
      <DashboardSection 
        title="Operacional"
        icon={<HardDrive className="mr-2 h-5 w-5 text-primary" />}
        items={operationalMenuItems}
        delay={0.2}
      />

      {/* Recent clients */}
      {recentClients && recentClients.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Building className="mr-2 h-5 w-5 text-primary" />
            Clientes Recentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentClients.slice(0, 3).map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{client.name}</CardTitle>
                  <CardDescription>
                    CNPJ: {client.cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-2">
                    {client.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50">
                        {tag}
                      </Badge>
                    ))}
                    {!client.tags?.length && <span className="text-sm text-muted-foreground">Sem tags</span>}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-2">
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    size="sm"
                    onClick={() => handleSelectClient(client.id)}
                    disabled={activeClient?.id === client.id}
                  >
                    {activeClient?.id === client.id ? "Cliente Ativo" : "Selecionar Cliente"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
