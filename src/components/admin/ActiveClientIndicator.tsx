
import React from 'react';
import { useActiveClient } from '@/hooks/useActiveClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ActiveClientIndicator = () => {
  const { activeClient, recentClients, setActiveClient, clearActiveClient } = useActiveClient();
  
  if (!activeClient) return null;
  
  const handleClearActiveClient = () => {
    clearActiveClient();
    toast.info('Cliente ativo removido');
  };
  
  const handleChangeActiveClient = (client) => {
    setActiveClient(client);
    toast.success(`Cliente alterado para: ${client.name}`);
  };
  
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 bg-primary/5 border-primary/10 text-primary">
            <Building className="h-3.5 w-3.5 mr-1.5" />
            <span className="max-w-[140px] truncate font-medium">
              {activeClient.name}
            </span>
            <Badge variant="outline" className="ml-2 text-[10px] px-1.5 bg-white/20">
              {activeClient.cnpj}
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-3">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Cliente Ativo</h4>
                <p className="text-sm text-muted-foreground">Todas as ações serão vinculadas a este cliente</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClearActiveClient}
                className="h-6 w-6 text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            <div className="p-3 border rounded-md bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{activeClient.name}</p>
                  <p className="text-xs text-muted-foreground">CNPJ: {activeClient.cnpj}</p>
                </div>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Segmento:</span>
                  <span>{activeClient.segment || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="capitalize">{activeClient.type === 'public' ? 'Público' : 'Privado'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Cidade:</span>
                  <span>{activeClient.city || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Estado:</span>
                  <span>{activeClient.state || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {recentClients.length > 1 && (
              <div>
                <h5 className="text-sm font-medium mb-1.5">Clientes Recentes</h5>
                <div className="space-y-1">
                  {recentClients
                    .filter(client => client.id !== activeClient.id)
                    .slice(0, 3)
                    .map(client => (
                      <Button
                        key={client.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChangeActiveClient(client)}
                        className="w-full justify-start text-xs h-auto py-1"
                      >
                        <Building className="h-3 w-3 mr-1.5" />
                        <span className="max-w-[180px] truncate">{client.name}</span>
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActiveClientIndicator;
