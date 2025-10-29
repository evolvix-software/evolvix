"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
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
  LogOut,
  ClipboardCheck,
  BarChart3,
  Users
} from 'lucide-react';

import { settingsData, SettingsSection } from '@/data/mock/settingsData';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  role: 'student' | 'mentor';
}

interface MenuItem {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const studentMenuItems: MenuItem[] = [
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

const mentorMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    subtitle: 'Overview & Stats',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/portal/mentor',
    badge: 'Live'
  },
  {
    id: 'courses',
    label: 'My Courses',
    subtitle: 'Create & Manage',
    icon: <BookOpen className="w-5 h-5" />,
    path: '/portal/mentor/courses'
  },
  {
    id: 'classes',
    label: 'Classes',
    subtitle: 'Schedule & Manage',
    icon: <Calendar className="w-5 h-5" />,
    path: '/portal/mentor/classes'
  },
  {
    id: 'students',
    label: 'Student Management',
    subtitle: 'Students & Feedback',
    icon: <Users className="w-5 h-5" />,
    path: '/portal/mentor/students',
    badge: '24'
  },
  {
    id: 'assignments',
    label: 'Assignments',
    subtitle: 'Review Submissions',
    icon: <FileText className="w-5 h-5" />,
    path: '/portal/mentor/assignments',
    badge: '12'
  },
  {
    id: 'projects',
    label: 'Project Mentorship',
    subtitle: 'Projects & Feedback',
    icon: <Lightbulb className="w-5 h-5" />,
    path: '/portal/mentor/projects'
  },
  {
    id: 'interviews',
    label: 'Interview Evaluation',
    subtitle: 'AI & Live Interviews',
    icon: <ClipboardCheck className="w-5 h-5" />,
    path: '/portal/mentor/interviews'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    subtitle: 'Reports & Metrics',
    icon: <BarChart3 className="w-5 h-5" />,
    path: '/portal/mentor/analytics'
  },
  {
    id: 'settings',
    label: 'Settings',
    subtitle: 'Preferences',
    icon: <Settings className="w-5 h-5" />,
    path: '/portal/mentor/settings'
  }
];

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
  Calendar,
  ClipboardCheck,
  BarChart3,
  Users
};

export function Sidebar({ isCollapsed, onToggle, role }: SidebarProps) {
  const router = useRouter();
  
  // Get verification level from Redux (only for student)
  const verificationLevel = useAppSelector((state) => 
    role === 'student' ? (state.verification.verificationStatus?.level || 0) : 0
  );
  
  const [settingsMenuItems, setSettingsMenuItems] = useState<SettingsSection[]>([]);
  const [isSettingsPage, setIsSettingsPage] = useState(false);
  const [activeSection, setActiveSection] = useState(role === 'mentor' ? 'profile' : 'basic');
  const [currentPath, setCurrentPath] = useState('');
  
  // Get menu items based on role
  const getMenuItems = (): MenuItem[] => {
    const items = role === 'student' ? studentMenuItems : mentorMenuItems;
    
    // Filter menu items based on verification level (only for student)
    if (role === 'student') {
      const allowedForLevel1 = ['dashboard', 'courses', 'profile', 'settings'];
    if (verificationLevel <= 1) {
        return items.filter(item => allowedForLevel1.includes(item.id));
      }
    }
    
    return items;
  };
  
  const visibleMenuItems = getMenuItems();
  
  // Use blue accent for all roles - matching the new theme
  const primaryColor = 'rgb(59, 130, 246)'; // Blue #3b82f6
  const primaryColorBg = 'bg-primary';
  const primaryColorShadow = 'shadow-primary/40';
  const headerIconBg = 'bg-primary';
  const headerIconShadow = 'shadow-primary/40';
  const activeBarColor = 'bg-primary';
  const activeIconColor = 'text-primary';
  const activeBadgeBg = 'bg-primary';
  const portalTitle = role === 'student' ? 'Student Portal' : 'Mentor Portal';
  const headerIcon = role === 'student' 
    ? <GraduationCap className="w-6 h-6 text-white" />
    : <User className="w-6 h-6 text-white" />;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      setIsSettingsPage(window.location.pathname.includes('/settings'));
    }
  }, []);
  
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
        setActiveSection(params.get('section') || (role === 'mentor' ? 'profile' : 'basic'));
      };
      
      updateSection();
      const interval = setInterval(updateSection, 100);
      return () => clearInterval(interval);
    }
  }, [isSettingsPage, role]);

  useEffect(() => {
    if (isSettingsPage) {
      const sections = role === 'student' 
        ? (settingsData.settingsSections.student as SettingsSection[])
        : (settingsData.settingsSections.mentor as SettingsSection[]);
      setSettingsMenuItems(sections);
    }
  }, [isSettingsPage, role]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={`flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 shadow-2xl ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${headerIconBg} rounded-xl flex items-center justify-center shadow-lg ${headerIconShadow}`}>
              {headerIcon}
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Evolvix</h1>
              <p className="text-xs text-muted-foreground font-medium">{portalTitle}</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-foreground" />
          )}
        </button>
          </div>

      {/* Today's Tasks Card - Only for Student */}
      {role === 'student' && (
        !isCollapsed ? (
        <div className="px-4 pt-4">
          <div className="bg-secondary rounded-xl p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${primaryColorBg} rounded-lg flex items-center justify-center`}>
                  <Clock className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-sm">Today's Tasks</h3>
                </div>
              </div>
              <div className="bg-muted text-foreground px-2.5 py-1 rounded-full text-xs font-bold">
                64
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-3 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <p className="text-xs">Next: Assignment Due</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-2 pt-4">
          <div className="bg-secondary rounded-xl p-3 hover:bg-accent transition-colors cursor-pointer flex items-center justify-center">
            <div className="relative">
              <div className={`w-10 h-10 ${primaryColorBg} rounded-lg flex items-center justify-center`}>
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center border-2 border-secondary">
                <span className="text-white text-xs font-bold">64</span>
              </div>
            </div>
          </div>
        </div>
        )
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-hide">
        {isSettingsPage ? (
          // Settings menu
          settingsMenuItems.map((section) => {
            const IconComponent = iconMap[section.icon] || Settings;
            const isActive = activeSection === section.id || currentPath?.includes(section.id);
            const settingsPath = role === 'student' 
              ? `/portal/student/settings?section=${section.id}`
              : `/portal/mentor/settings?section=${section.id}`;

            return (
              <button
                key={section.id}
                onClick={() => handleNavigation(settingsPath)}
                className={`group relative w-full ${
                  !isCollapsed ? 'flex items-start space-x-3' : 'flex items-center justify-start'
                } px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary'
                    : 'hover:bg-secondary'
                }`}
                title={isCollapsed ? section.label : undefined}
              >
                {isActive && !isCollapsed && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 ${activeBarColor} rounded-r-full`} />
                )}
                
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-white' 
                    : 'bg-transparent group-hover:bg-muted'
                }`}>
                  <div className={isActive ? activeIconColor : 'text-foreground'}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <span className={`text-sm font-semibold transition-all block overflow-hidden text-ellipsis whitespace-nowrap ${
                      isActive ? 'text-foreground' : 'text-foreground'
                    }`}>
                      {section.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })
        ) : (
          // Regular menu items
          visibleMenuItems.map((item) => {
            const isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
                className={`group relative w-full ${
                  !isCollapsed ? 'flex items-start space-x-3' : 'flex items-center justify-start'
                } px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary'
                    : 'hover:bg-secondary'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && !isCollapsed && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 ${activeBarColor} rounded-r-full`} />
                )}
                
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-white' 
                    : 'bg-transparent group-hover:bg-muted'
                }`}>
                  <div className={isActive ? activeIconColor : 'text-foreground'}>
                    {item.icon}
                  </div>
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold transition-all block overflow-hidden text-ellipsis whitespace-nowrap ${
                        isActive ? 'text-foreground' : 'text-foreground'
                      }`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                          isActive 
                            ? `${activeBadgeBg} text-primary-foreground` 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate block overflow-hidden text-ellipsis whitespace-nowrap">
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

      {/* User Profile Section */}
      <div className={`${!isCollapsed ? 'p-4' : 'p-2'} border-t border-border flex-shrink-0 space-y-2`}>
        <div className={`bg-secondary rounded-xl p-3 hover:bg-accent transition-all cursor-pointer ${!isCollapsed ? 'flex items-center space-x-3' : 'flex items-center justify-start'}`}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-foreground" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-secondary"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-foreground truncate block overflow-hidden text-ellipsis whitespace-nowrap">
                {role === 'student' ? 'John Doe' : 'Mentor Name'}
              </p>
              <p className="text-xs text-muted-foreground truncate block overflow-hidden text-ellipsis whitespace-nowrap">
                {role === 'student' ? 'john@example.com' : 'mentor@example.com'}
              </p>
              <div className="flex items-center space-x-1 mt-0.5">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-primary font-medium">Online</span>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/auth/signin';
          }}
          className={`w-full ${!isCollapsed ? 'flex items-center space-x-3' : 'flex items-center justify-start'} bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg px-3 py-2.5 transition-all`}
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
