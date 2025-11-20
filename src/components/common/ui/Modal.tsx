/**
 * Reusable Modal Component
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    fullscreen: 'max-w-full h-full m-0 rounded-none',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={cn(
          'bg-card rounded-lg shadow-xl w-full border border-border',
          sizes[size],
          size === 'fullscreen' && 'h-full flex flex-col'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}
        <div className={cn('p-6', size === 'fullscreen' && 'flex-1 overflow-auto')}>
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

