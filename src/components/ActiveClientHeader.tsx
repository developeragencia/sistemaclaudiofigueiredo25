
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, ChevronDown, Bell, ArrowRight, UserCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useClientStore } from '@/hooks/useClientStore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ActiveClientHeader = () => {
  const { activeClient, setActiveClient, recentClients } = useClientStore();
  const navigate = useNavigate();

  const handleClientSwitch = (client: any) => {
    setActiveClient(client);
    navigate('/dashboard');
  };

  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 py-2 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="text-xs text-muted-foreground mr-1.5">Cliente Ativo:</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className={cn(
                  "h-auto py-1.5 pl-2 pr-1 text-sm font-medium rounded-md",
                  activeClient ? "text-primary bg-primary/5" : "text-muted-foreground"
                )}>
                  {activeClient ? (
                    <div className="flex items-center">
                      <Building className="h-3.5 w-3.5 mr-1.5" />
                      <span className="max-w-[150px] truncate">{activeClient.name}</span>
                      <Badge variant="outline" className="ml-2 text-[10px] px-1.5 bg-white/10 border-primary/20">
                        {activeClient.cnpj}
                      </Badge>
                      <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Selecionar Cliente</span>
                      <ChevronDown className="ml-1 h-3.5 w-3.5" />
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium pb-1 border-b">Clientes Recentes</div>
                  {recentClients.length > 0 ? (
                    <div className="space-y-1">
                      {recentClients.map((client) => (
                        <Button 
                          key={client.id} 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-left"
                          onClick={() => handleClientSwitch(client)}
                        >
                          <Building className="h-3.5 w-3.5 mr-1.5" />
                          <span className="max-w-[180px] truncate">{client.name}</span>
                          <span className="ml-1 text-xs text-muted-foreground">({client.cnpj})</span>
                          {client.type === 'public' && (
                            <Badge variant="info" className="ml-2 text-[10px] px-1">Órgão Público</Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-2">
                      Nenhum cliente recente
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-between"
                    onClick={() => navigate('/clients')}
                  >
                    <span>Ver todos os clientes</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {activeClient && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="h-4 w-px bg-muted-foreground/30"></div>
              <Badge variant="outline" className="bg-primary/5">
                {activeClient.type === 'public' ? 'Órgão Público' : 'Empresa Privada'}
              </Badge>
              {activeClient.segment && (
                <Badge variant="outline" className="bg-primary/5">
                  {activeClient.segment}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs flex items-center gap-1.5"
              onClick={() => navigate('/profile')}
            >
              <UserCircle className="h-3.5 w-3.5" />
              <span>Claudio Figueiredo</span>
              <Badge variant="outline" className="ml-1 text-[10px] px-1 bg-green-500/10 text-green-600">
                Admin
              </Badge>
            </Button>
            <div className="h-4 w-px bg-muted-foreground/30 mx-2"></div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/security')}
            className="hidden md:flex h-8 w-8"
          >
            <Shield className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/notifications')}
            className="relative h-8 w-8"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveClientHeader;
