import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Shield,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Clientes',
    href: '/clients',
    icon: Users,
  },
  {
    name: 'Propostas',
    href: '/proposals',
    icon: FileText,
  },
  {
    name: 'Contratos',
    href: '/contracts',
    icon: FileText,
  },
];

const adminNavigation = [
  {
    name: 'Usuários',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN', 'MASTER_ADMIN'],
  },
  {
    name: 'Permissões',
    href: '/admin/roles',
    icon: Shield,
    roles: ['MASTER_ADMIN'],
  },
  {
    name: 'Auditoria',
    href: '/admin/audit',
    icon: ClipboardList,
    roles: ['ADMIN', 'MASTER_ADMIN'],
  },
];

interface NavItem {
  href: string;
  title: string;
  icon?: React.ReactNode;
  roles?: string[];
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[];
}

export function Sidebar({ className, items, ...props }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  const filteredItems = items.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => 
      user?.roles.some(userRole => userRole.name === role)
    );
  });

  return (
    <div className={cn('pb-12', className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Menu
            </h2>
            <ScrollArea className="h-[300px] px-2">
              <div className="space-y-1">
                {filteredItems.map((item, index) => (
                  <Button
                    key={index}
                    variant={isActive(item.href) ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to={item.href} className="flex items-center">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Configurações
          </h2>
          <Button 
            variant={isActive('/settings') ? 'secondary' : 'ghost'} 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 