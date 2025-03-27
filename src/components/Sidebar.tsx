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

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r">
      <nav className="p-4 space-y-2">
        {navigation.map(item => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-gray-100 dark:bg-gray-700 text-primary'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}

        {/* Admin Navigation */}
        {adminNavigation.some(item =>
          item.roles.some(role =>
            user?.roles.some(userRole => userRole.name === role)
          )
        ) && (
          <>
            <div className="pt-4">
              <div className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Administração
              </div>
            </div>
            {adminNavigation
              .filter(item =>
                item.roles.some(role =>
                  user?.roles.some(userRole => userRole.name === role)
                )
              )
              .map(item => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-gray-100 dark:bg-gray-700 text-primary'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
          </>
        )}
      </nav>
    </aside>
  );
} 