"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  role: 'student' | 'mentor';
}

export function Layout({ children, title, role }: LayoutProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          role={role}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu} />
          <div className="relative w-64 h-full">
            <Sidebar 
              isCollapsed={false} 
              onToggle={toggleMobileMenu}
              role={role}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-background">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden absolute top-4 left-4 z-10 p-2 bg-card border border-border rounded-lg shadow-lg"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Page Content - Card */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          <div className="bg-card rounded-3xl shadow-2xl border border-border h-full p-6 lg:p-8 overflow-y-auto content-scroll">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary hover:bg-accent transition-colors group mb-4"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground group-hover:text-foreground transition-colors" />
            </button>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

