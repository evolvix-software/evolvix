"use client";

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface StudentLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function StudentLayout({ children, title }: StudentLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-800 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
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
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden absolute top-4 left-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Page Content - Card */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-slate-700 dark:border-gray-700 h-full p-6 lg:p-8 overflow-y-auto content-scroll">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
