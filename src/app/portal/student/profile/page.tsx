"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { 
  User, 
  GraduationCap, 
  Award, 
  Shield,
  Camera,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Star,
  X as XIcon,
  Users,
  Briefcase,
  Trophy,
  Target,
  TrendingUp,
  CheckCircle2,
  Building2,
  MessageSquare,
  FileText,
  Zap
} from 'lucide-react';
import { mockConnections, mockCompanyConnections } from '@/data/mock/connectionsData';
import { CompanyConnectionRequest } from '@/interfaces/connections';
import { cn } from '@/utils';
import {
  updatePersonalInfo,
  updateEducationInfo,
  addSkill,
  removeSkill,
  addInterest,
  removeInterest,
  setProfilePicture,
  setEditingField,
} from '@/store/features/profile/profileSlice';

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  achieved: boolean;
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<CompanyConnectionRequest[]>([]);

  useEffect(() => {
    // Calculate milestones based on user data
    const connections = mockConnections.filter(c => c.status === 'connected');
    const companyConnections = mockCompanyConnections.filter(c => c.status === 'connected');
    
    const calculatedMilestones: Milestone[] = [
      {
        id: 'connections',
        title: 'Professional Connections',
        description: 'People you\'ve connected with',
        icon: <Users className="w-6 h-6" />,
        count: connections.length,
        color: 'from-blue-500 to-blue-600',
        achieved: connections.length > 0,
      },
      {
        id: 'companies',
        title: 'Company Connections',
        description: 'Companies you follow',
        icon: <Building2 className="w-6 h-6" />,
        count: companyConnections.length,
        color: 'from-purple-500 to-purple-600',
        achieved: companyConnections.length > 0,
      },
      {
        id: 'courses',
        title: 'Courses Completed',
        description: 'Courses you\'ve finished',
        icon: <GraduationCap className="w-6 h-6" />,
        count: 3, // Mock data - replace with actual
        color: 'from-green-500 to-green-600',
        achieved: true,
      },
      {
        id: 'assignments',
        title: 'Assignments Submitted',
        description: 'Projects completed',
        icon: <FileText className="w-6 h-6" />,
        count: profile.skills?.length || 0,
        color: 'from-orange-500 to-orange-600',
        achieved: (profile.skills?.length || 0) > 0,
      },
      {
        id: 'skills',
        title: 'Skills Mastered',
        description: 'Skills you\'ve added',
        icon: <Star className="w-6 h-6" />,
        count: profile.skills?.length || 0,
        color: 'from-yellow-500 to-yellow-600',
        achieved: (profile.skills?.length || 0) > 0,
      },
      {
        id: 'achievements',
        title: 'Achievements Unlocked',
        description: 'Badges earned',
        icon: <Trophy className="w-6 h-6" />,
        count: 5, // Mock data
        color: 'from-pink-500 to-pink-600',
        achieved: true,
      },
    ];
    
    setMilestones(calculatedMilestones);

    // Load connection requests from localStorage (simulating backend)
    const storedRequests = localStorage.getItem('companyConnectionRequests');
    if (storedRequests) {
      try {
        const requests = JSON.parse(storedRequests);
        // Filter requests for companies owned by current user (in real app, check user's companies)
        // For demo, show all pending requests
        setConnectionRequests(requests.filter((req: CompanyConnectionRequest) => req.status === 'pending'));
      } catch (e) {
        console.error('Error parsing connection requests:', e);
      }
    }
  }, [profile, mockConnections, mockCompanyConnections]);

  const handleAcceptConnectionRequest = (requestId: string) => {
    const updatedRequests = connectionRequests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'accepted' as const };
      }
      return req;
    });
    setConnectionRequests(updatedRequests.filter(req => req.status === 'pending'));

    // Update localStorage
    const storedRequests = localStorage.getItem('companyConnectionRequests');
    if (storedRequests) {
      const allRequests = JSON.parse(storedRequests);
      const updatedAllRequests = allRequests.map((req: CompanyConnectionRequest) => {
        if (req.id === requestId) {
          return { ...req, status: 'accepted' as const };
        }
        return req;
      });
      localStorage.setItem('companyConnectionRequests', JSON.stringify(updatedAllRequests));
    }

    // Update company connections
    const request = connectionRequests.find(req => req.id === requestId);
    if (request) {
      alert(`Connection request from ${request.fromUserName} accepted!`);
    }
  };

  const handleIgnoreConnectionRequest = (requestId: string) => {
    const updatedRequests = connectionRequests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'ignored' as const };
      }
      return req;
    });
    setConnectionRequests(updatedRequests.filter(req => req.status === 'pending'));

    // Update localStorage
    const storedRequests = localStorage.getItem('companyConnectionRequests');
    if (storedRequests) {
      const allRequests = JSON.parse(storedRequests);
      const updatedAllRequests = allRequests.map((req: CompanyConnectionRequest) => {
        if (req.id === requestId) {
          return { ...req, status: 'ignored' as const };
        }
        return req;
      });
      localStorage.setItem('companyConnectionRequests', JSON.stringify(updatedAllRequests));
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
  };

  const handleSavePersonalInfo = () => {
    dispatch(setEditingField({ field: 'personalInfo', value: false }));
  };

  const handleSaveEducationInfo = () => {
    dispatch(setEditingField({ field: 'educationInfo', value: false }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(addSkill({
        id: Date.now().toString(),
        name: newSkill,
        level: 'intermediate',
      }));
      setNewSkill('');
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      dispatch(addInterest({
        id: Date.now().toString(),
        name: newInterest,
        category: 'technology',
      }));
      setNewInterest('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setProfilePicture(reader.result as string));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Layout title="My Profile" role="student">
      <div className="space-y-6">
        {/* Milestones Section - GitHub Style */}
        <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-foreground">
              <Trophy className="w-5 h-5 text-primary" />
              <span>Milestones & Achievements</span>
            </CardTitle>
            <CardDescription>Track your progress and celebrate your achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={cn(
                    "relative p-6 rounded-xl border-2 transition-all duration-300",
                    milestone.achieved
                      ? "border-[#635bff] bg-gradient-to-br from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20"
                      : "border-slate-200 dark:border-border bg-slate-50 dark:bg-secondary opacity-60"
                  )}
                >
                  {milestone.achieved && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    milestone.achieved
                      ? `bg-gradient-to-br ${milestone.color} text-white`
                      : "bg-slate-200 dark:bg-border text-slate-400"
                  )}>
                    {milestone.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-foreground mb-1">
                    {milestone.count}
                  </h3>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {milestone.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connection Requests - For Company Owners */}
        {connectionRequests.length > 0 && (
          <Card className="border-slate-200 dark:border-border bg-card dark:bg-card border-l-4 border-l-[#635bff]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-foreground">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span>Connection Requests</span>
                <Badge variant="default" className="ml-2 bg-primary text-white">
                  {connectionRequests.length}
                </Badge>
              </CardTitle>
              <CardDescription>People who want to connect with your companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectionRequests.map(request => (
                  <div
                    key={request.id}
                    className="p-4 border border-slate-200 dark:border-border rounded-lg bg-slate-50 dark:bg-secondary"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold">
                        {getInitials(request.fromUserName)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-foreground">
                              {request.fromUserName}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {request.fromUserTitle || 'Student'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              Wants to connect with <span className="font-medium">{request.toCompanyName}</span> • {formatTimeAgo(request.sentAt)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-card dark:bg-card rounded-lg border border-slate-200 dark:border-border">
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {request.note}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAcceptConnectionRequest(request.id)}
                            className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIgnoreConnectionRequest(request.id)}
                            className="border-slate-300 dark:border-slate-600"
                          >
                            <XIcon className="w-4 h-4 mr-2" />
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connections Overview */}
        <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span>My Network</span>
            </CardTitle>
            <CardDescription>Your professional connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Connections */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-foreground">Connections</h3>
                  <Badge variant="default" className="text-lg font-bold border border-slate-300 dark:border-slate-600">
                    {mockConnections.filter(c => c.status === 'connected').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {mockConnections.filter(c => c.status === 'connected').slice(0, 3).map(conn => (
                    <div key={conn.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-secondary rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(conn.userName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-foreground text-sm truncate">
                          {conn.userName}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {conn.userTitle} {conn.company && `• ${conn.company}`}
                        </p>
                      </div>
                      <Badge variant="default" className="text-xs border border-slate-300 dark:border-slate-600">
                        {conn.connectionLevel}
                      </Badge>
                    </div>
                  ))}
                  {mockConnections.filter(c => c.status === 'connected').length > 3 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center pt-2">
                      +{mockConnections.filter(c => c.status === 'connected').length - 3} more connections
                    </p>
                  )}
                </div>
              </div>

              {/* Company Connections */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-foreground">Companies</h3>
                  <Badge variant="default" className="text-lg font-bold border border-slate-300 dark:border-slate-600">
                    {mockCompanyConnections.filter(c => c.status === 'connected').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {mockCompanyConnections.filter(c => c.status === 'connected').map(comp => (
                    <div key={comp.companyId} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-secondary rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(comp.companyName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-foreground text-sm">
                          {comp.companyName}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Connected
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Profile Picture</span>
            </CardTitle>
            <CardDescription>Upload and manage your profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-[#4f48cc] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                  ) : (
                    'JD'
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-slate-700 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-600 dark:hover:bg-gray-600 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-foreground">John Doe</h3>
                <p className="text-slate-600 dark:text-slate-400">Student at Evolvix</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
            </div>
            {profile.isEditing.personalInfo ? (
              <Button onClick={handleSavePersonalInfo} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            ) : (
              <Button onClick={() => dispatch(setEditingField({ field: 'personalInfo', value: true }))} variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue={profile.personalInfo.firstName || 'John'}
                  disabled={!profile.isEditing.personalInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue={profile.personalInfo.lastName || 'Doe'}
                  disabled={!profile.isEditing.personalInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Date of Birth
                </label>
                <input
                  type="date"
                  defaultValue={profile.personalInfo.dateOfBirth || '2000-01-01'}
                  disabled={!profile.isEditing.personalInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Gender
                </label>
                <select
                  defaultValue={profile.personalInfo.gender || 'male'}
                  disabled={!profile.isEditing.personalInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  defaultValue={profile.personalInfo.email || 'john@example.com'}
                  disabled={!profile.isEditing.personalInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </label>
                <input
                  type="tel"
                  defaultValue={profile.personalInfo.phone || '+1234567890'}
                  disabled={!profile.isEditing.personalInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Education Information</span>
              </CardTitle>
              <CardDescription>Your academic background</CardDescription>
            </div>
            {profile.isEditing.educationInfo ? (
              <Button onClick={handleSaveEducationInfo} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            ) : (
              <Button onClick={() => dispatch(setEditingField({ field: 'educationInfo', value: true }))} variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">College/University</label>
                <input
                  type="text"
                  defaultValue={profile.educationInfo.college || 'Tech University'}
                  disabled={!profile.isEditing.educationInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Degree</label>
                <input
                  type="text"
                  defaultValue={profile.educationInfo.degree || 'Bachelor of Science'}
                  disabled={!profile.isEditing.educationInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Year</label>
                <input
                  type="text"
                  defaultValue={profile.educationInfo.year || '2024'}
                  disabled={!profile.isEditing.educationInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Specialization</label>
                <input
                  type="text"
                  defaultValue={profile.educationInfo.specialization || 'Computer Science'}
                  disabled={!profile.isEditing.educationInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-primary" />
                <span>Skills & Interests</span>
              </CardTitle>
              <CardDescription>Your skills and preferred courses</CardDescription>
            </div>
            <Button onClick={() => dispatch(setEditingField({ field: 'skills', value: !profile.isEditing.skills }))} variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              {profile.isEditing.skills ? 'Done' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Skill */}
            {profile.isEditing.skills && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground"
                />
                <Button onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>
            )}

            {/* Skills List */}
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <div key={skill.id} className="flex items-center space-x-2 px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-full">
                  <span className="text-sm font-medium">{skill.name}</span>
                  {profile.isEditing.skills && (
                    <button
                      onClick={() => dispatch(removeSkill(skill.id))}
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {profile.skills.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400">No skills added yet</p>
              )}
            </div>

            {/* Add Interest */}
            {profile.isEditing.skills && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-foreground"
                  />
                  <Button onClick={handleAddInterest}>
                    Add Interest
                  </Button>
                </div>
              </div>
            )}

            {/* Interests List */}
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <div key={interest.id} className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                  <span className="text-sm font-medium">{interest.name}</span>
                  {profile.isEditing.skills && (
                    <button
                      onClick={() => dispatch(removeInterest(interest.id))}
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {profile.interests.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400">No interests added yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KYC Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>KYC / ID Verification Status</span>
            </CardTitle>
            <CardDescription>Your identity verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  profile.kycStatus.status === 'verified' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : profile.kycStatus.status === 'rejected'
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : 'bg-primary/10 dark:bg-primary/20'
                }`}>
                  <Shield className={`w-6 h-6 ${
                    profile.kycStatus.status === 'verified'
                      ? 'text-green-600 dark:text-green-400'
                      : profile.kycStatus.status === 'rejected'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-primary dark:text-primary'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-foreground capitalize">
                    {profile.kycStatus.status} Verification
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {profile.kycStatus.idUploaded ? 'ID uploaded' : 'ID not uploaded'}
                  </p>
                </div>
              </div>
              <Button variant="outline">
                {profile.kycStatus.status === 'verified' ? 'View Status' : 'Start Verification'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

