"use client";

import React, { useState, useEffect } from 'react';
import { Messaging, MessagingProps } from './Messaging';
import { MessageList } from './MessageList';
import { MessageSquare, X, Minimize2, Maximize2, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils';

export interface FloatingMessagingProps extends Omit<MessagingProps, 'className' | 'showCloseButton'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  className?: string;
}

export function FloatingMessaging({
  position = 'bottom-right',
  initialWidth = 800, // Increased for expanded view
  initialHeight = 600,
  minWidth = 320,
  minHeight = 400,
  className,
  ...messagingProps
}: FloatingMessagingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // New state for expanded view
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [positionState, setPositionState] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Collapsed panel dimensions (just showing conversation list)
  const collapsedWidth = 380;
  const collapsedHeight = 500;
  
  // Expanded panel dimensions (full messaging view)
  const expandedWidth = 800; // Increased width for better layout
  const expandedHeight = 600;

  // Calculate initial position based on position prop
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const updatePosition = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 20;
        
        // Use collapsed or expanded dimensions
        const currentWidth = isExpanded ? expandedWidth : collapsedWidth;
        const currentHeight = isExpanded ? expandedHeight : collapsedHeight;

        let x = 0;
        let y = 0;

        switch (position) {
          case 'bottom-right':
            x = viewportWidth - currentWidth - margin;
            y = viewportHeight - currentHeight - margin - 80; // Account for header
            break;
          case 'bottom-left':
            x = margin;
            y = viewportHeight - currentHeight - margin - 80;
            break;
          case 'top-right':
            x = viewportWidth - currentWidth - margin;
            y = margin + 80;
            break;
          case 'top-left':
            x = margin;
            y = margin + 80;
            break;
        }

        setPositionState({ x, y });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isOpen, isMinimized, isExpanded, position, dimensions]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsExpanded(true);
  };
  
  // Handle back button (collapse to list view)
  const handleBack = () => {
    setIsExpanded(false);
    setSelectedConversationId(null);
  };

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.no-drag')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - positionState.x,
      y: e.clientY - positionState.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - dimensions.width;
      const maxY = window.innerHeight - dimensions.height;
      
      setPositionState({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, dimensions]);

  // Handle resize
  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(minWidth, Math.min(startWidth + (e.clientX - startX), window.innerWidth - positionState.x));
      const newHeight = Math.max(minHeight, Math.min(startHeight + (e.clientY - startY), window.innerHeight - positionState.y));
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Ensure conversations array exists
  const conversations = messagingProps.conversations || [];

  return (
    <div style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none' }} className="inset-0">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            setIsExpanded(false);
            setSelectedConversationId(null);
          }}
          className={cn(
            'absolute p-4 bg-gradient-to-r from-primary to-primary text-white rounded-full shadow-2xl hover:shadow-[#635bff]/50 transition-all duration-300 hover:scale-110',
            'flex items-center justify-center pointer-events-auto',
            position === 'bottom-right' && 'bottom-6 right-6',
            position === 'bottom-left' && 'bottom-6 left-6',
            position === 'top-right' && 'top-6 right-6',
            position === 'top-left' && 'top-6 left-6'
          )}
          title="Open Messages"
        >
          <MessageSquare className="w-6 h-6" />
          {conversations.some(c => c.unreadCount > 0) && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-card dark:border-slate-800">
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
            </span>
          )}
        </button>
      )}

      {/* Floating Window */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={() => {
              setIsOpen(false);
              setIsExpanded(false);
              setSelectedConversationId(null);
            }}
          />

          {/* Messaging Window */}
          <div
            ref={containerRef}
            className={cn(
              'absolute bg-card dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all duration-300 pointer-events-auto',
              isMinimized && 'h-14',
              !isMinimized && 'resize overflow-auto',
              isDragging && 'cursor-move',
              className
            )}
            style={{
              width: isMinimized 
                ? dimensions.width 
                : isExpanded 
                  ? `${expandedWidth}px` 
                  : `${collapsedWidth}px`,
              height: isMinimized 
                ? '56px' 
                : isExpanded 
                  ? `${expandedHeight}px` 
                  : `${collapsedHeight}px`,
              left: `${positionState.x}px`,
              top: `${positionState.y}px`,
            }}
          >
            {/* Header Bar */}
            <div
              className="flex items-center justify-between p-3 bg-gradient-to-r from-primary to-primary text-white cursor-move no-drag"
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center gap-2">
                {isExpanded && (
                  <button
                    onClick={handleBack}
                    className="p-1 hover:bg-card/20 rounded transition-colors no-drag mr-1"
                    title="Back to conversations"
                  >
                    <X className="w-4 h-4 rotate-45" />
                  </button>
                )}
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-semibold text-sm">
                  {isExpanded ? 'Messages' : 'Conversations'}
                </h3>
                {messagingProps.conversations.some(c => c.unreadCount > 0) && (
                  <span className="px-2 py-0.5 bg-card/20 rounded-full text-xs font-bold">
                    {messagingProps.conversations.reduce((sum, c) => sum + c.unreadCount, 0)} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 no-drag">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-card/20 rounded transition-colors"
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpanded(false);
                    setSelectedConversationId(null);
                  }}
                  className="p-1.5 hover:bg-card/20 rounded transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messaging Content */}
            {!isMinimized && (
              <div 
                className="flex-1 overflow-hidden" 
                style={{ 
                  height: isExpanded 
                    ? `${expandedHeight - 56}px` 
                    : `${collapsedHeight - 56}px` 
                }}
              >
                {isExpanded ? (
                  <Messaging
                    {...messagingProps}
                    showCloseButton={false}
                    className="h-full"
                    initialConversationId={selectedConversationId}
                  />
                ) : (
                  <div className="h-full overflow-hidden">
                    <MessageList
                      conversations={messagingProps.conversations}
                      selectedConversationId={selectedConversationId || undefined}
                      filters={{ tab: 'focused', search: '' }}
                      currentUserId={messagingProps.currentUserId}
                      onSelectConversation={handleSelectConversation}
                      onSearchChange={() => {}}
                      onTabChange={() => {}}
                      onPinConversation={messagingProps.onPinConversation}
                      onArchiveConversation={messagingProps.onArchiveConversation}
                      onMuteConversation={messagingProps.onMuteConversation}
                      className="h-full"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Resize Handle */}
            {!isMinimized && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-slate-200 dark:bg-slate-700 hover:bg-primary dark:hover:bg-primary transition-colors no-drag"
                onMouseDown={handleResize}
                style={{
                  clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

