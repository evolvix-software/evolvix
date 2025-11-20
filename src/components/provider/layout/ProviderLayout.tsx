"use client";

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Megaphone,
  FileText,
  Users,
  Wallet,
  BarChart3,
  UsersRound,
  MessageSquare,
  FileBarChart,
  Settings,
  Menu,
  X,
  LogOut,
  Building2,
} from 'lucide-react';
import { cn } from '@/utils';
import { providerService } from '@/data/mock/providerData';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/portal/provider/dashboard' },
  { label: 'Programs & Courses', icon: GraduationCap, href: '/portal/provider/programs' },
  { label: 'Campaigns', icon: Megaphone, href: '/portal/provider/campaigns' },
  { label: 'Applications', icon: FileText, href: '/portal/provider/applications' },
  { label: 'Scholars', icon: Users, href: '/portal/provider/scholars' },
  { label: 'Fund Management', icon: Wallet, href: '/portal/provider/funds' },
  { label: 'Analytics', icon: BarChart3, href: '/portal/provider/analytics' },
  { label: 'Mentors', icon: UsersRound, href: '/portal/provider/mentors' },
  { label: 'Communications', icon: MessageSquare, href: '/portal/provider/communications' },
  { label: 'Reports', icon: FileBarChart, href: '/portal/provider/reports' },
  { label: 'Settings', icon: Settings, href: '/portal/provider/settings' },
];

interface ProviderLayoutProps {
  children: ReactNode;
}

export function ProviderLayout({ children }: ProviderLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const provider = providerService.getCurrentProvider();

  const handleLogout = () => {
    localStorage.removeItem('evolvix_current_provider');
    localStorage.removeItem('evolvix_registration');
    router.push('/auth/signin');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Evolvix</h1>
                <p className="text-xs text-muted-foreground">Provider Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground hover:text-sidebar-accent-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Provider Info */}
          {provider && (
            <div className="p-4 border-b border-sidebar-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {provider.organizationName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {provider.contactEmail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-header border-b border-header-border flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-header-foreground hover:text-header-foreground/80"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            {(() => {
              const currentProvider = providerService.getCurrentProvider();
              return currentProvider ? (
                <div className="text-sm text-header-foreground">
                  <span className="font-medium">Balance: </span>
                  <span className="text-primary">₹{currentProvider.balance.toLocaleString()}</span>
                </div>
              ) : null;
            })()}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto content-scroll p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

