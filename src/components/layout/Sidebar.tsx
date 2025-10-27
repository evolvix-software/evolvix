"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { 
  LayoutDashboard,
  User,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Bot,
  Award,
  Lightbulb,
  Briefcase,
  Trophy,
  Bell,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  GraduationCap,
  Settings,
  Clock,
  CheckCircle,
  Shield,
  Lock,
  CreditCard,
  Palette,
  Camera,
  Key,
  LogOut
} from 'lucide-react';

import { Button } from '@/components/forms/Button';
import { settingsData, SettingsSection } from '@/data/mock/settingsData';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    subtitle: 'Overview & Progress',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/portal/student',
    badge: 'Live'
  },
  {
    id: 'courses',
    label: 'Courses',
    subtitle: 'Browse & Learn',
    icon: <BookOpen className="w-5 h-5" />,
    path: '/portal/student/courses'
  },
  {
    id: 'assignments',
    label: 'Assignments',
    subtitle: 'Tasks & Projects',
    icon: <FileText className="w-5 h-5" />,
    path: '/portal/student/assignments',
    badge: '12'
  },
  {
    id: 'live-classes',
    label: 'Live Classes',
    subtitle: 'Join Sessions',
    icon: <Video className="w-5 h-5" />,
    path: '/portal/student/live-classes'
  },
  {
    id: 'profile',
    label: 'My Profile',
    subtitle: 'Personal Information',
    icon: <User className="w-5 h-5" />,
    path: '/portal/student/profile'
  },
  {
    id: 'mentors',
    label: 'Mentors',
    subtitle: 'Connect & Learn',
    icon: <Lightbulb className="w-5 h-5" />,
    path: '/portal/student/mentors',
    badge: '5'
  },
  {
    id: 'scholarships',
    label: 'Scholarships',
    subtitle: 'Financial Aid',
    icon: <Award className="w-5 h-5" />,
    path: '/portal/student/scholarships'
  },
  {
    id: 'jobs',
    label: 'Jobs & Opportunities',
    subtitle: 'Career Path',
    icon: <Briefcase className="w-5 h-5" />,
    path: '/portal/student/jobs'
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    subtitle: 'Compete & Win',
    icon: <Trophy className="w-5 h-5" />,
    path: '/portal/student/hackathons'
  },
  {
    id: 'settings',
    label: 'Settings',
    subtitle: 'Preferences',
    icon: <Settings className="w-5 h-5" />,
    path: '/portal/student/settings'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    subtitle: 'Alerts & Updates',
    icon: <Bell className="w-5 h-5" />,
    path: '/portal/student/notifications',
    badge: '9'
  }
];

interface MenuItem {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const iconMap: Record<string, any> = {
  LayoutDashboard,
  User,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Bot,
  Award,
  Lightbulb,
  Briefcase,
  Trophy,
  Bell,
  Settings,
  Shield,
  Lock,
  CreditCard,
  Palette,
  Camera,
  Key,
  GraduationCap,
};

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  
  const [settingsMenuItems, setSettingsMenuItems] = useState<SettingsSection[]>([]);
  const [isSettingsPage, setIsSettingsPage] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [currentPath, setCurrentPath] = useState('');
  
  useEffect(() => {
    // Get current path safely
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      setIsSettingsPage(window.location.pathname.includes('/settings'));
    }
  }, []);
  
  // Listen for pathname changes
  useEffect(() => {
    const updatePath = () => {
      if (typeof window !== 'undefined') {
        const newPath = window.location.pathname;
        setCurrentPath(newPath);
        setIsSettingsPage(newPath.includes('/settings'));
      }
    };
    
    updatePath();
    window.addEventListener('popstate', updatePath);
    const interval = setInterval(updatePath, 100);
    return () => {
      window.removeEventListener('popstate', updatePath);
      clearInterval(interval);
    };
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && isSettingsPage) {
      const updateSection = () => {
        const params = new URLSearchParams(window.location.search);
        setActiveSection(params.get('section') || 'basic');
      };
      
      updateSection();
      const interval = setInterval(updateSection, 100);
      return () => clearInterval(interval);
    }
  }, [isSettingsPage]);

  useEffect(() => {
    if (isSettingsPage) {
      // Load student settings data
      const studentSections = settingsData.settingsSections.student as SettingsSection[];
      setSettingsMenuItems(studentSections);
    }
  }, [isSettingsPage]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={`flex flex-col h-screen bg-slate-800 dark:bg-gray-800 border-r border-slate-700 dark:border-gray-700 transition-all duration-300 shadow-2xl ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 dark:border-gray-700 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#635bff] rounded-xl flex items-center justify-center shadow-lg shadow-[#635bff]/40">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Evolvix</h1>
              <p className="text-xs text-slate-400 font-medium">Student Portal</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
              className="p-2 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5 text-slate-300" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>

      {/* Today's Tasks Card */}
      {!isCollapsed ? (
        <div className="px-4 pt-4">
          <div className="bg-slate-700 dark:bg-gray-700 rounded-xl p-4 hover:bg-slate-600 dark:hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#635bff] rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Today's Tasks</h3>
                </div>
              </div>
              <div className="bg-slate-600 dark:bg-gray-600 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                64
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-3 text-slate-300">
              <Calendar className="w-4 h-4" />
              <p className="text-xs">Next: Assignment Due</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-2 pt-4">
          <div className="bg-slate-700 dark:bg-gray-700 rounded-xl p-3 hover:bg-slate-600 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center justify-center">
            <div className="relative">
              <div className="w-10 h-10 bg-[#635bff] rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-slate-700">
                <span className="text-white text-xs font-bold">64</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu - Scrollable with hidden scrollbar */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-hide">
        {isSettingsPage ? (
          // Settings menu - simple clickable items
          settingsMenuItems.map((section) => {
            const IconComponent = iconMap[section.icon] || Settings;
            const isActive = activeSection === section.id || currentPath?.includes(section.id);

            return (
              <button
                key={section.id}
                onClick={() => handleNavigation(`/portal/student/settings?section=${section.id}`)}
                className={`group relative w-full ${
                  !isCollapsed ? 'flex items-start space-x-3' : 'flex items-center justify-center'
                } px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-700 dark:bg-gray-700'
                    : 'hover:bg-slate-700 dark:hover:bg-gray-700'
                }`}
                title={isCollapsed ? section.label : undefined}
              >
                {/* Active indicator bar */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#635bff] rounded-r-full" />
                )}
                
                {/* Icon with white background when active */}
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-white' 
                    : 'bg-transparent group-hover:bg-slate-600 dark:group-hover:bg-gray-600'
                }`}>
                  <div className={isActive ? 'text-[#635bff]' : 'text-slate-300'}>
                    <IconComponent className="w-5 h-5" />
                  </div>
      </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold transition-all ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}>
                        {section.label}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })
        ) : (
          // Regular menu items
          menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
                className={`group relative w-full ${
                  !isCollapsed ? 'flex items-start space-x-3' : 'flex items-center justify-center'
                } px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                    ? 'bg-slate-700 dark:bg-gray-700'
                    : 'hover:bg-slate-700 dark:hover:bg-gray-700'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active indicator bar */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#635bff] rounded-r-full" />
                )}
                
                {/* Icon with white background when active */}
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-white' 
                    : 'bg-transparent group-hover:bg-slate-600 dark:group-hover:bg-gray-600'
                }`}>
                  <div className={isActive ? 'text-[#635bff]' : 'text-slate-300'}>
                {item.icon}
              </div>
                  {/* Collapsed mode badge */}
                  {isCollapsed && item.badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#635bff] rounded-full flex items-center justify-center border-2 border-slate-800">
                      <span className="text-white text-xs font-bold">{item.badge}</span>
                    </div>
                  )}
                </div>
                
              {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold transition-all ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isActive 
                            ? 'bg-[#635bff] text-white' 
                            : 'bg-slate-600 dark:bg-gray-600 text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
              )}
            </button>
          );
          })
        )}
      </nav>

      {/* User Profile Section with Logout */}
      <div className={`${!isCollapsed ? 'p-4' : 'p-2'} border-t border-slate-700 dark:border-gray-700 flex-shrink-0 space-y-2`}>
        <div className={`bg-slate-700 dark:bg-gray-700 rounded-xl p-3 hover:bg-slate-600 dark:hover:bg-gray-600 transition-all cursor-pointer ${!isCollapsed ? 'flex items-center space-x-3' : 'flex justify-center'}`}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-slate-600 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-700 dark:border-gray-700"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-slate-400 truncate">
                john@example.com
              </p>
              <div className="flex items-center space-x-1 mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-400 font-medium">Online</span>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            // Clear all storage
            localStorage.clear();
            // Redirect to login
            window.location.href = '/auth/signin';
          }}
          className={`w-full ${!isCollapsed ? 'flex items-center space-x-3' : 'flex justify-center'} bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg px-3 py-2.5 transition-all`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && (
            <span className="text-sm font-semibold">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
