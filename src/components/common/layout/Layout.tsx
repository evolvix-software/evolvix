"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FloatingMessaging } from '../messaging/FloatingMessaging';
import { useMessaging } from '@/hooks/useMessaging';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  role: 'student' | 'mentor' | 'admin' | 'provider';
  onViewChange?: (view: string) => void;
  currentView?: string; // For admin to track current view
  adminUser?: { fullName?: string; email?: string }; // Admin user info
  noPaddingX?: boolean; // Remove horizontal padding for full-width content
  noCard?: boolean; // Remove card wrapper for full-width content
}

export function Layout({ children, title, role, onViewChange, currentView, adminUser, noPaddingX = false, noCard = false }: LayoutProps) {
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

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    if (typeof window === 'undefined') return 'user-1';
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const data = JSON.parse(storedData);
      return data.email || 'user-1';
    }
    return 'user-1';
  };

  // Use the messaging hook for full functionality
  const currentUserId = getCurrentUserId();
  const {
    conversations,
    handleSendMessage,
    handleReactToMessage,
    handleEditMessage,
    handleDeleteMessage,
    handlePinConversation,
    handleArchiveConversation,
    handleMuteConversation,
    handleDeleteConversation,
  } = useMessaging(currentUserId);

  return (
    <>
    <div className="h-screen flex overflow-hidden bg-background relative">
      {/* Desktop Sidebar - Full Height */}
      {!sidebarCollapsed && (
        <div className="hidden lg:flex h-full">
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={toggleSidebar}
            role={role}
            onViewChange={onViewChange}
            currentView={currentView}
            adminUser={adminUser}
          />
        </div>
      )}
      {/* Collapsed sidebar - fully hidden */}
      {sidebarCollapsed && (
        <div className="hidden lg:block w-0"></div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu} />
          <div className="relative w-64 h-full">
            <Sidebar 
              isCollapsed={false} 
              onToggle={toggleMobileMenu}
              role={role}
              onViewChange={onViewChange}
              currentView={currentView}
              adminUser={adminUser}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Header - Touches Sidebar */}
        <Header onMenuToggle={toggleSidebar} title={title} />

        {/* Main Content with Navigation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Text Navigation Bar - Inside Body */}
          <div className="bg-navbar border-b border-border px-4 py-2">
            <div className="text-xs text-navbar-text lowercase">
              {role === 'provider' ? (
                <>
                  <button onClick={() => router.push('/portal/provider/dashboard')} className="hover:text-navbar-text-hover">
                    dashboard
                  </button>
                  {title && (
                    <>
                      <span> - </span>
                      <span className="text-navbar-text-active">{title.toLowerCase()}</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button onClick={() => router.push('/portal/student')} className="hover:text-navbar-text-hover">
                    dashboard
                  </button>
                  <span> - </span>
                  <button onClick={() => router.push('/portal/student/courses')} className="hover:text-navbar-text-hover">
                    my courses
                  </button>
                  {title && (
                    <>
                      <span> - </span>
                      <span className="text-navbar-text-active">{title.toLowerCase()}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Page Content */}
          <main className={`flex-1 overflow-y-auto bg-background ${noPaddingX ? '' : 'p-3 lg:p-6'}`}>
            {noCard ? (
              <div className="h-full overflow-y-auto content-scroll">
                {children}
              </div>
            ) : (
              <div className="bg-card rounded-3xl shadow-2xl border border-border h-full p-6 lg:p-8 overflow-y-auto content-scroll">
                {children}
              </div>
            )}
          </main>
        </div>
      </div>

    </div>
    {/* Floating Messaging Widget - Outside overflow container */}
      <FloatingMessaging
        conversations={conversations}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        onReactToMessage={handleReactToMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onPinConversation={handlePinConversation}
        onArchiveConversation={handleArchiveConversation}
        onMuteConversation={handleMuteConversation}
        onDeleteConversation={handleDeleteConversation}
        position="bottom-right"
        initialWidth={800}
        initialHeight={600}
    />
    </>
  );
}

