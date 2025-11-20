"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell,
  Sun,
  Menu,
  GraduationCap,
  Clock
} from 'lucide-react';

import { Button } from '@/components/common/forms/Button';
import { useTheme } from '@/hooks';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

export function Header({ onMenuToggle, title }: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [studentInfo, setStudentInfo] = useState<{ id?: string; degree?: string }>({});

  useEffect(() => {
    // Initialize time on client-side only to avoid hydration mismatch
    setCurrentTime(new Date());
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load student info
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Mock student ID and degree - in real app, this would come from API
        setStudentInfo({
          id: 'ST10205401',
          degree: 'BSc IT Degree curr F2015'
        });
      } catch (e) {
        console.error('Error parsing registration data:', e);
      }
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} UTC`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <header className="bg-header border-b border-header-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Sidebar Toggle and Logo */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="p-2 hover:bg-secondary"
            >
              <Menu className="w-5 h-5 text-header-foreground" />
            </Button>
            
            {/* Evolvix Logo - Blue Diamond */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">EV</span>
              </div>
              {title && (
                <span className="text-header-foreground text-sm font-medium">{title}</span>
              )}
            </div>
          </div>

          {/* Right Section - 3 Data Sections */}
          <div className="flex items-center space-x-4">
            {/* Section 1: Theme Toggle and Notifications */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                <Sun className="w-5 h-5 text-yellow-500" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-secondary rounded-lg relative"
              >
                <Bell className="w-5 h-5 text-header-foreground" />
              </Button>
            </div>

            {/* Section 2: Time and Date */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg">
              <Clock className="w-4 h-4 text-header-foreground" />
              <div className="flex flex-col">
                {currentTime ? (
                  <>
                    <span className="text-header-foreground text-sm font-semibold">{formatTime(currentTime)}</span>
                    <span className="text-muted-foreground text-xs">{formatDate(currentTime)}</span>
                  </>
                ) : (
                  <>
                    <span className="text-header-foreground text-sm font-semibold">--:--:-- UTC</span>
                    <span className="text-muted-foreground text-xs">Loading...</span>
                  </>
                )}
              </div>
            </div>

            {/* Section 3: Student ID and Degree */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-secondary rounded-lg">
              <GraduationCap className="w-4 h-4 text-header-foreground" />
              <div className="flex flex-col">
                <span className="text-header-foreground text-sm font-semibold">{studentInfo.id || 'ST10205401'}</span>
                <span className="text-muted-foreground text-xs">{studentInfo.degree || 'BSc IT Degree curr F2015'}</span>
              </div>
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-header-foreground text-xs font-semibold">RA</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
