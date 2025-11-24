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
  UserCheck,
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
  Users,
  FileVideo,
  Megaphone,
  Wallet,
  UsersRound,
  FileBarChart
} from 'lucide-react';

import { settingsData, SettingsSection } from '@/data/mock/settingsData';
import Image from 'next/image';
import { evolvixLogo } from '@/assets/assets';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  role: 'student' | 'mentor' | 'admin' | 'provider';
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
    id: 'campaigns',
    label: 'Scholarship Campaigns',
    subtitle: 'Manage Campaigns',
    icon: <Megaphone className="w-5 h-5" />,
    path: '/admin/campaigns',
  },
  {
    id: 'reports',
    label: 'Reports & Exports',
    subtitle: 'System-wide Reports',
    icon: <FileText className="w-5 h-5" />,
    path: '/admin/reports',
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

// Student menu items organized by category
interface StudentMenuCategory {
  category: string;
  items: MenuItem[];
}

const studentMenuCategories: StudentMenuCategory[] = [
  {
    category: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        subtitle: 'Overview & Progress',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/portal/student',
        badge: 'Live'
      },
    ]
  },
  {
    category: 'Learning',
    items: [
      {
        id: 'courses',
        label: 'Browse Courses',
        subtitle: 'Discover & Enroll',
        icon: <BookOpen className="w-5 h-5" />,
        path: '/portal/student/courses'
      },
      {
        id: 'my-courses',
        label: 'My Courses',
        subtitle: 'Enrolled Courses',
        icon: <BookOpen className="w-5 h-5" />,
        path: '/portal/student/my-courses',
        badge: undefined // Will be dynamically set based on enrolled courses count
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
        path: '/portal/student/classes'
      },
      {
        id: 'recordings',
        label: 'Recordings',
        subtitle: 'Watch Recorded Classes',
        icon: <FileVideo className="w-5 h-5" />,
        path: '/portal/student/recordings'
      },
    ]
  },
  {
    category: 'Opportunities',
    items: [
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
        id: 'interviews',
        label: 'AI Mock Interview',
        subtitle: 'Practice Interviews',
        icon: <Bot className="w-5 h-5" />,
        path: '/portal/student/interviews'
      },
      {
        id: 'interview-prep',
        label: 'Interview Preparation',
        subtitle: 'Manual Training',
        icon: <UserCheck className="w-5 h-5" />,
        path: '/portal/student/interviews/preparation'
      },
    ]
  },
  {
    category: 'Community',
    items: [
      {
        id: 'mentors',
        label: 'Mentors',
        subtitle: 'Connect & Learn',
        icon: <Lightbulb className="w-5 h-5" />,
        path: '/portal/student/mentors',
        badge: '5'
      },
    ]
  },
  {
    category: 'Account',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        subtitle: 'Profile & Preferences',
        icon: <Settings className="w-5 h-5" />,
        path: '/portal/student/settings',
        badge: '9'
      },
    ]
  }
];

// Flattened version for backward compatibility
const studentMenuItems: MenuItem[] = studentMenuCategories.flatMap(category => category.items);

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
    category: 'Premium Features',
    items: [
      {
        id: 'hackathons',
        label: 'Hackathons',
        subtitle: 'Manage Links',
        icon: <Trophy className="w-5 h-5" />,
        path: '/portal/mentor/hackathons'
      },
      {
        id: 'scholarships',
        label: 'Scholarships',
        subtitle: 'Review Applications',
        icon: <Award className="w-5 h-5" />,
        path: '/portal/mentor/scholarships'
      },
      {
        id: 'interviews',
        label: 'Interviews',
        subtitle: 'Manage Interviews',
        icon: <Bot className="w-5 h-5" />,
        path: '/portal/mentor/interviews'
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

// Provider menu items organized by category
interface ProviderMenuCategory {
  category: string;
  items: MenuItem[];
}

const providerMenuCategories: ProviderMenuCategory[] = [
  {
    category: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        subtitle: 'Overview & Impact',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/portal/provider/dashboard',
      },
    ]
  },
  {
    category: 'Scholarships',
    items: [
      {
        id: 'programs',
        label: 'Programs & Courses',
        subtitle: 'Browse Available Courses',
        icon: <GraduationCap className="w-5 h-5" />,
        path: '/portal/provider/programs',
      },
      {
        id: 'campaigns',
        label: 'Campaigns',
        subtitle: 'Manage Scholarship Campaigns',
        icon: <Megaphone className="w-5 h-5" />,
        path: '/portal/provider/campaigns',
      },
      {
        id: 'applications',
        label: 'Applications',
        subtitle: 'Review & Verify',
        icon: <FileText className="w-5 h-5" />,
        path: '/portal/provider/applications',
      },
      {
        id: 'scholars',
        label: 'Scholars',
        subtitle: 'Track Awarded Scholars',
        icon: <Users className="w-5 h-5" />,
        path: '/portal/provider/scholars',
      },
    ]
  },
  {
    category: 'Management',
    items: [
      {
        id: 'funds',
        label: 'Fund Management',
        subtitle: 'Transfers & Disbursements',
        icon: <Wallet className="w-5 h-5" />,
        path: '/portal/provider/funds',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        subtitle: 'Impact & Growth Metrics',
        icon: <BarChart3 className="w-5 h-5" />,
        path: '/portal/provider/analytics',
      },
    ]
  },
  {
    category: 'Account',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        subtitle: 'Profile & Preferences',
        icon: <Settings className="w-5 h-5" />,
        path: '/portal/provider/settings',
      },
    ]
  }
];

const providerMenuItems: MenuItem[] = providerMenuCategories.flatMap(category => category.items);

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
  Users,
  Megaphone,
  Wallet,
  UsersRound,
  FileBarChart
};

// Provider Profile Component to avoid hydration issues
function ProviderProfileSection({ isCollapsed }: { isCollapsed: boolean }) {
  const [providerName, setProviderName] = useState('Provider');
  const [providerEmail, setProviderEmail] = useState('provider@evolvix.com');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get provider info from localStorage (client-side only)
    const providerData = localStorage.getItem('evolvix_current_provider');
    const provider = providerData ? JSON.parse(providerData) : null;
    const registrationData = localStorage.getItem('evolvix_registration');
    const regData = registrationData ? JSON.parse(registrationData) : null;

    if (provider?.organizationName) {
      setProviderName(provider.organizationName);
      setProviderEmail(provider.contactEmail || regData?.email || 'provider@evolvix.com');
    } else if (regData?.fullName) {
      setProviderName(regData.fullName);
      setProviderEmail(regData.email || 'provider@evolvix.com');
    }
  }, []);

  return (
    <div className={`bg-secondary rounded-xl p-3 hover:bg-accent transition-all cursor-pointer ${!isCollapsed ? 'flex items-center space-x-3' : 'flex items-center justify-start'}`}>
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-foreground" />
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-secondary"></div>
      </div>
      {!isCollapsed && (
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-foreground truncate block overflow-hidden text-ellipsis whitespace-nowrap">
            {mounted ? providerName : 'Provider'}
          </p>
          <p className="text-xs text-muted-foreground truncate block overflow-hidden text-ellipsis whitespace-nowrap">
            {mounted ? providerEmail : 'provider@evolvix.com'}
          </p>
          <div className="flex items-center space-x-1 mt-0.5">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-xs text-primary font-medium">Online</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ isCollapsed, onToggle, role, onViewChange, currentView, adminUser }: SidebarProps) {
  const router = useRouter();

  // Get verification status from Redux
  const verificationStatus = useAppSelector((state) => state.verification.verificationStatus);
  const isVerified = verificationStatus?.status === 'approved';
  const verificationLevel = verificationStatus?.level || 0;

  // Get enrolled courses count for student badge
  const enrolledCourses = useAppSelector((state) => state.courses.enrolledCourses);
  const enrolledCoursesCount = role === 'student' ? enrolledCourses.length : 0;

  const [settingsMenuItems, setSettingsMenuItems] = useState<SettingsSection[]>([]);
  const [isSettingsPage, setIsSettingsPage] = useState(false);
  const [activeSection, setActiveSection] = useState(role === 'mentor' ? 'profile' : 'basic');
  const [currentPath, setCurrentPath] = useState('');

  // Get menu items based on role
  const getMenuItems = (): MenuItem[] => {
    if (role === 'admin') {
      return adminMenuItems;
    }
    if (role === 'provider') {
      return providerMenuItems;
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
  const portalTitle = role === 'student' ? 'Student Portal'
    : role === 'mentor' ? 'Mentor Portal'
      : role === 'provider' ? 'Provider Portal'
        : 'Admin Portal';
  const headerIcon = role === 'student'
    ? <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
    : role === 'mentor'
      ? <User className="w-6 h-6 text-sidebar-primary-foreground" />
      : role === 'provider'
        ? <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
        : <Shield className="w-6 h-6 text-sidebar-primary-foreground" />;

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
        if (role === 'provider') {
          // Extract section from pathname for provider
          const path = window.location.pathname;
          const sectionMatch = path.match(/\/settings\/([^\/]+)/);
          setActiveSection(sectionMatch ? sectionMatch[1] : 'profile');
        } else {
          const params = new URLSearchParams(window.location.search);
          setActiveSection(params.get('section') || (role === 'mentor' ? 'profile' : 'basic'));
        }
      };

      updateSection();
      const interval = setInterval(updateSection, 100);
      return () => clearInterval(interval);
    }
  }, [isSettingsPage, role]);

  useEffect(() => {
    if (isSettingsPage) {
      if (role === 'provider') {
        // Provider settings sections
        const providerSections: SettingsSection[] = [
          { id: 'profile', label: 'Organization Profile', icon: 'User' },
          { id: 'security', label: 'Account & Security', icon: 'Shield' },
          { id: 'payment', label: 'Payment Methods', icon: 'CreditCard' },
          { id: 'notifications', label: 'Notifications', icon: 'Bell' },
          { id: 'preferences', label: 'Preferences', icon: 'Palette' },
          { id: 'privacy', label: 'Privacy & Security', icon: 'Lock' },
        ];
        setSettingsMenuItems(providerSections);
      } else {
        const sections = role === 'student'
          ? (settingsData.settingsSections.student as SettingsSection[])
          : (settingsData.settingsSections.mentor as SettingsSection[]);
        setSettingsMenuItems(sections);
      }
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
    <div className={`flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 shadow-2xl ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'
      }`}>
      {/* Header */}
      <div className="flex flex-col items-start p-4 border-b border-border flex-shrink-0 gap-2">
        <div className="flex items-center space-x-3">
          {/* Evolvix Logo */}
          <Image
            src={evolvixLogo}
            alt="Evolvix"
            width={160}
            height={50}
            className="h-auto w-auto drop-shadow-lg"
            priority
          />
        </div>

        {/* Portal Name Badge */}
        <div className="px-1">
          <div className="px-2 py-1 bg-primary/10 rounded text-xs font-medium text-primary uppercase tracking-wider w-fit">
            {role === 'student' ? 'Student Portal' :
              role === 'mentor' ? 'Mentor Portal' :
                role === 'provider' ? 'Scholarship Provider Portal' :
                  'Admin Portal'}
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
                  <span className="text-sidebar-primary-foreground text-xs font-bold">64</span>
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
              : role === 'mentor'
                ? `/portal/mentor/settings?section=${section.id}`
                : `/portal/provider/settings/${section.id}`;

            return (
              <button
                key={section.id}
                onClick={() => handleNavigation(settingsPath)}
                className={`group relative w-full ${!isCollapsed ? 'flex items-start space-x-3' : 'flex items-center justify-start'
                  } px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-secondary'
                    : 'hover:bg-secondary'
                  }`}
                title={isCollapsed ? section.label : undefined}
              >
                {isActive && !isCollapsed && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 ${activeBarColor} rounded-r-full`} />
                )}

                <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isActive
                  ? 'bg-sidebar-primary-foreground'
                  : 'bg-transparent group-hover:bg-muted'
                  }`}>
                  <div className={isActive ? activeIconColor : 'text-foreground'}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <span className={`text-sm font-semibold transition-all block overflow-hidden text-ellipsis whitespace-nowrap ${isActive ? 'text-foreground' : 'text-foreground'
                      }`}>
                      {section.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })
        ) : (role === 'student' || role === 'mentor' || role === 'provider') && !isCollapsed ? (
          // Student, Mentor, or Provider menu with categories
          (role === 'student' ? studentMenuCategories
            : role === 'mentor' ? mentorMenuCategories
              : providerMenuCategories).map((category) => (
                <div key={category.category} className="mb-4">
                  <div className="px-3 mb-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category.category}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
                      // Dynamic badge for My Courses
                      const badgeToShow = item.id === 'my-courses' && enrolledCoursesCount > 0
                        ? enrolledCoursesCount.toString()
                        : item.badge;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path, item.id)}
                          className={`group relative w-full flex items-start space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                            ? 'bg-secondary'
                            : 'hover:bg-secondary'
                            }`}
                          title={item.label}
                        >
                          {isActive && (
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 ${activeBarColor} rounded-r-full`} />
                          )}

                          <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isActive
                            ? 'bg-sidebar-primary-foreground'
                            : 'bg-transparent group-hover:bg-muted'
                            }`}>
                            <div className={isActive ? activeIconColor : 'text-foreground'}>
                              {item.icon}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-semibold transition-all block overflow-hidden text-ellipsis whitespace-nowrap ${isActive ? 'text-foreground' : 'text-foreground'
                                }`}>
                                {item.label}
                              </span>
                              {badgeToShow && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${isActive
                                  ? `${activeBadgeBg} text-primary-foreground`
                                  : 'bg-muted text-muted-foreground'
                                  }`}>
                                  {badgeToShow}
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
          // Regular menu items (for collapsed sidebar or admin role)
          visibleMenuItems.map((item) => {
            // For admin, check view state; for others, check path
            let isActive = false;
            if (role === 'admin') {
              // Admin uses view state from parent
              isActive = currentView === item.id;
            } else {
              isActive = currentPath === item.path || currentPath?.startsWith(item.path + '/');
            }

            // Dynamic badge for My Courses
            const badgeToShow = item.id === 'my-courses' && enrolledCoursesCount > 0
              ? enrolledCoursesCount.toString()
              : item.badge;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`group relative w-full ${!isCollapsed ? 'flex items-start space-x-3' : 'flex items-center justify-start'
                  } px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-secondary'
                    : 'hover:bg-secondary'
                  }`}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && !isCollapsed && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 ${activeBarColor} rounded-r-full`} />
                )}

                <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isActive
                  ? 'bg-sidebar-primary-foreground'
                  : 'bg-transparent group-hover:bg-muted'
                  }`}>
                  <div className={isActive ? activeIconColor : 'text-foreground'}>
                    {item.icon}
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold transition-all block overflow-hidden text-ellipsis whitespace-nowrap ${isActive ? 'text-foreground' : 'text-foreground'
                        }`}>
                        {item.label}
                      </span>
                      {badgeToShow && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${isActive
                          ? `${activeBadgeBg} text-primary-foreground`
                          : 'bg-muted text-muted-foreground'
                          }`}>
                          {badgeToShow}
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
        ) : role === 'provider' ? (
          <ProviderProfileSection isCollapsed={isCollapsed} />
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
