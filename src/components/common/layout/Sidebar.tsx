"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks';
import { Calendar } from 'lucide-react';
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
  role: 'student' | 'mentor' | 'admin';
  onViewChange?: (view: string) => void;
  currentView?: string; // For admin to track current view
  adminUser?: { fullName?: string; email?: string }; // Admin user info
}

interface MenuItem {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const adminMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    subtitle: 'Overview & Statistics',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/admin',
  },
  {
    id: 'users',
    label: 'User Management',
    subtitle: 'Manage All Users',
    icon: <Users className="w-5 h-5" />,
    path: '/admin',
  },
  {
    id: 'verifications',
    label: 'Verifications',
    subtitle: 'Review & Approve',
    icon: <Shield className="w-5 h-5" />,
    path: '/admin',
  },
  {
    id: 'vacancies',
    label: 'Course Vacancies',
    subtitle: 'Manage Vacancies',
    icon: <Briefcase className="w-5 h-5" />,
    path: '/admin/vacancies',
  },
  {
    id: 'applications',
    label: 'Mentor Applications',
    subtitle: 'Review Applications',
    icon: <FileText className="w-5 h-5" />,
    path: '/admin/applications',
  },
  {
    id: 'course-verification',
    label: 'Course Verification',
    subtitle: 'Verify Courses',
    icon: <CheckCircle className="w-5 h-5" />,
    path: '/admin/course-verification',
  },
];

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
    id: 'tests',
    label: 'Tests',
    subtitle: 'Module Assessments',
    icon: <ClipboardCheck className="w-5 h-5" />,
    path: '/portal/student/tests'
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

// Mentor menu items organized by category
interface MentorMenuCategory {
  category: string;
  items: MenuItem[];
}

const mentorMenuCategories: MentorMenuCategory[] = [
  {
    category: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        subtitle: 'Overview & Stats',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/portal/mentor',
        badge: 'Live'
      },
    ]
  },
  {
    category: 'Teaching',
    items: [
      {
        id: 'courses',
        label: 'My Courses',
        subtitle: 'Create & Manage',
        icon: <BookOpen className="w-5 h-5" />,
        path: '/portal/mentor/courses'
      },
      {
        id: 'vacancies',
        label: 'Course Vacancies',
        subtitle: 'Apply for Bundle Courses',
        icon: <Briefcase className="w-5 h-5" />,
        path: '/portal/mentor/vacancies'
      },
      {
        id: 'classes',
        label: 'Classes',
        subtitle: 'Schedule & Manage',
        icon: <Calendar className="w-5 h-5" />,
        path: '/portal/mentor/classes'
      },
      {
        id: 'tests',
        label: 'Module Tests',
        subtitle: 'Create & Manage Tests',
        icon: <FileText className="w-5 h-5" />,
        path: '/portal/mentor/tests'
      },
    ]
  },
  {
    category: 'Students',
    items: [
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
    ]
  },
  {
    category: 'Communication',
    items: [
      {
        id: 'messages',
        label: 'Messages',
        subtitle: 'Unified Inbox',
        icon: <MessageSquare className="w-5 h-5" />,
        path: '/portal/mentor/messages',
        badge: '12'
      },
      {
        id: 'announcements',
        label: 'Announcements',
        subtitle: 'Course Updates',
        icon: <Bell className="w-5 h-5" />,
        path: '/portal/mentor/announcements'
      },
    ]
  },
  {
    category: 'Analytics & Tools',
    items: [
      {
        id: 'analytics',
        label: 'Analytics',
        subtitle: 'Reports & Metrics',
        icon: <BarChart3 className="w-5 h-5" />,
        path: '/portal/mentor/analytics'
      },
      {
        id: 'calendar',
        label: 'Calendar',
        subtitle: 'Schedule & Events',
        icon: <Calendar className="w-5 h-5" />,
        path: '/portal/mentor/calendar'
      },
    ]
  },
  {
    category: 'Settings',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        subtitle: 'Preferences',
        icon: <Settings className="w-5 h-5" />,
        path: '/portal/mentor/settings'
      },
    ]
  }
];

// Flattened version for backward compatibility
const mentorMenuItems: MenuItem[] = mentorMenuCategories.flatMap(category => category.items);

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

export function Sidebar({ isCollapsed, onToggle, role, onViewChange, currentView, adminUser }: SidebarProps) {
  const router = useRouter();
  
  // Get verification status from Redux
  const verificationStatus = useAppSelector((state) => state.verification.verificationStatus);
  const isVerified = verificationStatus?.status === 'approved';
  const verificationLevel = verificationStatus?.level || 0;
  
  const [settingsMenuItems, setSettingsMenuItems] = useState<SettingsSection[]>([]);
  const [isSettingsPage, setIsSettingsPage] = useState(false);
  const [activeSection, setActiveSection] = useState(role === 'mentor' ? 'profile' : 'basic');
  const [currentPath, setCurrentPath] = useState('');
  
  // Get menu items based on role
  const getMenuItems = (): MenuItem[] => {
    if (role === 'admin') {
      return adminMenuItems;
    }
    const items = role === 'student' ? studentMenuItems : mentorMenuItems;
    
    // TODO: Re-enable verification-based menu filtering after UI is complete
    // Filter menu items based on verification status
    // if (!isVerified) {
    //   // When not verified, only show limited menu items
    //   if (role === 'student') {
    //     const allowedForUnverified = ['dashboard', 'profile', 'settings'];
    //     return items.filter(item => allowedForUnverified.includes(item.id));
    //   } else if (role === 'mentor') {
    //     const allowedForUnverified = ['dashboard', 'profile', 'settings'];
    //     return items.filter(item => allowedForUnverified.includes(item.id));
    //   }
    // }
    
    // If verified, show all menu items
    // For now, show all menu items regardless of verification status
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
  const portalTitle = role === 'student' ? 'Student Portal' : role === 'mentor' ? 'Mentor Portal' : 'Admin Portal';
  const headerIcon = role === 'student' 
    ? <GraduationCap className="w-6 h-6 text-white" />
    : role === 'mentor'
    ? <User className="w-6 h-6 text-white" />
    : <Shield className="w-6 h-6 text-white" />;
  
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

  const handleNavigation = (path: string, itemId?: string) => {
    if (role === 'admin' && onViewChange && itemId) {
      // For admin, use view change callback instead of routing
      onViewChange(itemId);
    } else {
      router.push(path);
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 shadow-2xl ${
      isCollapsed ? 'w-0 overflow-hidden' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center space-x-3">
          {/* Evolvix Logo - Blue Diamond */}
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">EV</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-tight">EVOLVIX</h1>
          </div>
        </div>
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
        ) : role === 'mentor' && !isCollapsed ? (
          // Mentor menu with categories
          mentorMenuCategories.map((category) => (
            <div key={category.category} className="mb-4">
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category.category}
                </h3>
              </div>
              <div className="space-y-1">
                {category.items.map((item) => {
                  const isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path, item.id)}
                      className={`group relative w-full flex items-start space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-secondary'
                          : 'hover:bg-secondary'
                      }`}
                      title={item.label}
                    >
                      {isActive && (
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
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          // Regular menu items (for collapsed mentor sidebar or other roles)
          visibleMenuItems.map((item) => {
            // For admin, check view state; for others, check path
            let isActive = false;
            if (role === 'admin') {
              // Admin uses view state from parent
              isActive = currentView === item.id;
            } else {
              isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
            }
            
            return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
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
        {role === 'admin' && adminUser ? (
          <div className={`bg-secondary rounded-xl p-3 hover:bg-accent transition-all cursor-pointer ${!isCollapsed ? 'flex items-center space-x-3' : 'flex items-center justify-start'}`}>
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-secondary"></div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-foreground truncate block overflow-hidden text-ellipsis whitespace-nowrap">
                  {adminUser.fullName || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground truncate block overflow-hidden text-ellipsis whitespace-nowrap">
                  {adminUser.email || 'admin@evolvix.com'}
                </p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-xs text-primary font-medium">Online</span>
                </div>
              </div>
            )}
          </div>
        ) : role !== 'admin' && (
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
        )}

        {/* Logout Button */}
        <button
          onClick={() => {
            if (role === 'admin') {
              // Admin logout - clear admin token
              if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_jwt_token');
                window.location.href = '/admin/login';
              }
            } else {
              localStorage.clear();
              window.location.href = '/auth/signin';
            }
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
