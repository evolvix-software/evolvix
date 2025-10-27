"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  User
} from 'lucide-react';

import { Button } from '@/components/forms/Button';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export function Header({ onMenuToggle, title }: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('evolvix_registration');
    router.push('/auth/signin');
  };

  return (
    <header className="bg-slate-800 dark:bg-gray-900 border-b border-slate-700 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-slate-700 dark:hover:bg-gray-800"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </Button>
          
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Welcome back, John Doe
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2.5 w-80 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-700 dark:hover:bg-gray-800"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-300" />
            ) : (
              <Sun className="w-5 h-5 text-slate-300" />
            )}
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-700 dark:hover:bg-gray-800 relative"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                    <p className="text-sm text-gray-900 dark:text-white">
                      New assignment posted for React Development course
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      2 hours ago
                    </p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Live class starting in 30 minutes
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      1 hour ago
                    </p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Scholarship application approved
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      3 hours ago
                    </p>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full text-orange-600 dark:text-orange-400">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-slate-700 dark:hover:bg-gray-800"
          >
            <Settings className="w-5 h-5 text-slate-300" />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-700 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center ring-2 ring-slate-700">
                <span className="text-white font-bold text-xs">JD</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-white text-left">John Doe</p>
                <p className="text-xs text-slate-400">Student</p>
              </div>
              <LogOut className="w-4 h-4 text-slate-400" />
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    john@example.com
                  </p>
                </div>
                <div className="py-1">
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Profile Settings
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Account Settings
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
