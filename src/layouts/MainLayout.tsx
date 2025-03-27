import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  Menu,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    title: 'Clientes',
    icon: Users,
    href: '/clients'
  },
  {
    title: 'Propostas',
    icon: FileText,
    href: '/proposals'
  },
  {
    title: 'Configurações',
    icon: Settings,
    href: '/settings'
  }
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform",
        !sidebarOpen && "-translate-x-full"
      )}>
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-bold">Secure Bridge</h1>
        </div>
        
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "min-h-screen transition-all",
        sidebarOpen ? "pl-64" : "pl-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.email}</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 