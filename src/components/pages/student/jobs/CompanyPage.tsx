/**
 * Company Page - LinkedIn-style company profile with recent posts
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Building2,
  Users,
  MapPin,
  Globe,
  ExternalLink,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Share2,
  MoreVertical,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  Link as LinkIcon,
  X,
  Check,
  UserPlus,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { mockJobs } from '@/data/mock/jobsData';
import { mockCompanyConnections, mockCompanyConnectionRequests } from '@/data/mock/connectionsData';
import { CompanyConnection } from '@/interfaces/connections';
import { cn } from '@/utils';
import { 
  getCompanyPosts, 
  likeCompanyPost, 
  addPostComment,
  followCompany,
  unfollowCompany,
  isCompanyFollowed,
  getFollowedCompanies,
  fetchJobs
} from '@/services/jobService';
import { CompanyPost as ServiceCompanyPost } from '@/interfaces/jobs';

interface CompanyPost {
  id: string;
  content: string;
  postedAt: string;
  likes: number;
  comments: number;
  reposts: number;
  image?: string;
}

interface Employee {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  connectionLevel: '1st' | '2nd' | '3rd' | 'outside';
  connectionStatus: 'connected' | 'pending' | 'not-connected';
  location?: string;
  mutualConnections?: number;
}

const mockEmployees: Record<string, Employee[]> = {
  'Tecosys': [
    {
      id: 'emp-1',
      name: 'Rajesh Kumar',
      title: 'Senior AI Engineer',
      connectionLevel: '1st',
      connectionStatus: 'connected',
      location: 'Pune, India',
      mutualConnections: 5,
    },
    {
      id: 'emp-2',
      name: 'Priya Sharma',
      title: 'Frontend Lead',
      connectionLevel: '2nd',
      connectionStatus: 'not-connected',
      location: 'Mumbai, India',
      mutualConnections: 3,
    },
    {
      id: 'emp-3',
      name: 'Amit Patel',
      title: 'Product Manager',
      connectionLevel: 'outside',
      connectionStatus: 'pending',
      location: 'Bangalore, India',
    },
    {
      id: 'emp-4',
      name: 'Sneha Reddy',
      title: 'UX Designer',
      connectionLevel: '2nd',
      connectionStatus: 'not-connected',
      location: 'Hyderabad, India',
      mutualConnections: 2,
    },
    {
      id: 'emp-5',
      name: 'Vikram Singh',
      title: 'Backend Developer',
      connectionLevel: '1st',
      connectionStatus: 'connected',
      location: 'Delhi, India',
      mutualConnections: 8,
    },
  ],
  'Quik Hire': [
    {
      id: 'emp-6',
      name: 'Anjali Mehta',
      title: 'Recruitment Specialist',
      connectionLevel: 'outside',
      connectionStatus: 'not-connected',
      location: 'Gurgaon, India',
    },
    {
      id: 'emp-7',
      name: 'Rohit Verma',
      title: 'HR Manager',
      connectionLevel: '2nd',
      connectionStatus: 'not-connected',
      location: 'Noida, India',
      mutualConnections: 4,
    },
  ],
  'Emireq': [
    {
      id: 'emp-8',
      name: 'Kavita Nair',
      title: 'Tech Recruiter',
      connectionLevel: 'outside',
      connectionStatus: 'not-connected',
      location: 'Chennai, India',
    },
  ],
};

const mockCompanyPosts: Record<string, CompanyPost[]> = {
  'Tecosys': [
    {
      id: 'post-1',
      content: 'AI That Knows Your Business — Meet Nutaan\'s $1 Live Chat Widget\n\nMost chatbots talk. Nutaan AI listens, understands context, and delivers personalized responses that feel human. Built for enterprises, priced for everyone.\n\nTry it today: nutaan.ai',
      postedAt: '2024-12-10T10:00:00Z',
      likes: 45,
      comments: 12,
      reposts: 8,
    },
    {
      id: 'post-2',
      content: 'Happy Diwali from Tecosys! 🪔\n\nThis Diwali, we celebrate the triumph of light over darkness, knowledge over ignorance. As we build the next generation of AI models, we\'re grateful for our team, partners, and the innovation that drives us forward.\n\nWishing everyone a prosperous and joyful Diwali!',
      postedAt: '2024-11-12T14:30:00Z',
      likes: 128,
      comments: 23,
      reposts: 15,
    },
    {
      id: 'post-3',
      content: 'We\'re hiring! 🚀\n\nJoin Tecosys and help shape the future of enterprise AI. We\'re looking for talented developers, data scientists, and AI engineers who are passionate about building responsible AI solutions.\n\nCheck out our open positions: tecosys.in/careers',
      postedAt: '2024-11-05T09:15:00Z',
      likes: 89,
      comments: 18,
      reposts: 12,
    },
  ],
  'Quik Hire': [
    {
      id: 'post-4',
      content: 'Excited to announce our new remote hiring platform! Connect with top talent from anywhere in the world. #RemoteWork #Hiring',
      postedAt: '2024-12-08T11:00:00Z',
      likes: 67,
      comments: 15,
      reposts: 9,
    },
  ],
  'Emireq': [
    {
      id: 'post-5',
      content: 'Building the future of recruitment technology. Our AI-powered platform helps companies find the right candidates faster.',
      postedAt: '2024-12-05T13:00:00Z',
      likes: 34,
      comments: 8,
      reposts: 5,
    },
  ],
};

type TabType = 'home' | 'about' | 'posts' | 'jobs' | 'people';

export function CompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'not-connected' | 'pending' | 'connected'>('not-connected');
  const [posts, setPosts] = useState<CompanyPost[]>([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [connectNote, setConnectNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [employeeConnections, setEmployeeConnections] = useState<Record<string, 'connected' | 'pending' | 'not-connected'>>({});
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const job = mockJobs.find(j => j.company === companyName);
  const companyConnection = mockCompanyConnections.find(c => c.companyName === companyName);

  useEffect(() => {
    const loadCompanyData = async () => {
      // Load posts from service
      const servicePosts = await getCompanyPosts(companyName);
      const convertedPosts: CompanyPost[] = servicePosts.map(post => ({
        id: post.id,
        content: post.content,
        postedAt: post.postedAt,
        likes: post.likes.length,
        comments: post.comments.length,
        reposts: post.reposts.length,
        image: post.image,
      }));
      
      // Merge with mock posts if service has none
      const allPosts = convertedPosts.length > 0 ? convertedPosts : (mockCompanyPosts[companyName] || []);
      setPosts(allPosts);
      
      // Initialize post likes
      const initialLikes: Record<string, number> = {};
      allPosts.forEach(post => {
        initialLikes[post.id] = post.likes;
      });
      setPostLikes(initialLikes);
      
      // Check if company is followed
      const followed = await isCompanyFollowed(companyName);
      setIsFollowing(followed);
      
      // Load connection status
      if (companyConnection) {
        setConnectionStatus(companyConnection.status === 'connected' ? 'connected' : companyConnection.status === 'pending' ? 'pending' : 'not-connected');
        setConnected(companyConnection.status === 'connected');
      }
      
      // Update followers count
      if (job) {
        const baseFollowers = job.companyInfo.followers;
        // If this company is followed, increment count
        const adjustedFollowers = followed ? baseFollowers + 1 : baseFollowers;
        setFollowersCount(adjustedFollowers);
      }
      
      // Initialize employee connections
      const employees = mockEmployees[companyName] || [];
      const initialConnections: Record<string, 'connected' | 'pending' | 'not-connected'> = {};
      employees.forEach(emp => {
        initialConnections[emp.id] = emp.connectionStatus;
      });
      setEmployeeConnections(initialConnections);
    };
    
    loadCompanyData();
  }, [companyName, companyConnection, job]);

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

  const getCompanyInitials = (company: string) => {
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleConnect = () => {
    if (connectionStatus === 'not-connected') {
      setShowConnectModal(true);
    } else if (connectionStatus === 'pending') {
      // Show withdraw confirmation
      setShowWithdrawModal(true);
    }
  };

  const handleWithdrawConnection = () => {
      setConnectionStatus('not-connected');
      setConnected(false);
    setShowWithdrawModal(false);
  };

  const handleSubmitConnect = () => {
    // Validate note is provided
    if (!connectNote.trim()) {
      setNoteError('Please add a note to your connection request');
      return;
    }

    if (connectNote.trim().length < 10) {
      setNoteError('Note must be at least 10 characters long');
      return;
    }

    // Create connection request
    const connectionRequest = {
      id: `comp-req-${Date.now()}`,
      fromUserId: 'current-student', // In real app, get from auth context
      fromUserName: 'John Doe', // In real app, get from user profile
      fromUserTitle: 'Student at Evolvix',
      toCompanyId: companyJob.company.toLowerCase().replace(/\s+/g, '-'),
      toCompanyName: companyJob.company,
      note: connectNote.trim(),
      sentAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    // In real app, this would send to backend API
    // For now, we'll simulate by storing in localStorage and updating state
    const existingRequests = JSON.parse(localStorage.getItem('companyConnectionRequests') || '[]');
    existingRequests.push(connectionRequest);
    localStorage.setItem('companyConnectionRequests', JSON.stringify(existingRequests));

    // Update local state
    setConnectionStatus('pending');
    setConnected(false);
    setShowConnectModal(false);
    setConnectNote('');
    setNoteError('');

    // Show success message
    alert(`Connection request sent to ${companyJob.company}! They will be notified and can accept your request.`);
  };

  const handleAcceptConnection = () => {
    setConnectionStatus('connected');
    setConnected(true);
  };

  const handleIgnoreConnection = () => {
    setConnectionStatus('not-connected');
    setConnected(false);
  };

  const nextPost = () => {
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    }
  };

  const prevPost = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
    }
  };

  const handleLikePost = async (postId: string) => {
    const userId = 'current-student'; // In real app, get from auth context
    await likeCompanyPost(companyName, postId, userId);
    
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        setPostLikes(prevLikes => ({ ...prevLikes, [postId]: (prevLikes[postId] || 0) - 1 }));
      } else {
        newSet.add(postId);
        setPostLikes(prevLikes => ({ ...prevLikes, [postId]: (prevLikes[postId] || 0) + 1 }));
      }
      return newSet;
    });
  };

  const handleFollowCompany = async () => {
    if (isFollowing) {
      await unfollowCompany(companyName);
      setIsFollowing(false);
      setFollowersCount(prev => Math.max(0, prev - 1));
    } else {
      await followCompany(companyName);
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  if (!job) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Company not found</p>
          {/* <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button> */}
        </div>
      </div>
    );
  }

  // TypeScript guard - job is guaranteed to be defined after the check above
  const companyJob = job;

  return (
    <div className="h-full min-h-[calc(100vh-200px)] bg-card">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Company Banner */}
      <div className="bg-gradient-to-r from-muted to-secondary h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-5xl mx-auto px-6 relative h-full">
          <div className="absolute -bottom-16 left-6">
            <div className="w-40 h-40 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-2xl border-4 border-card ring-4 ring-primary/20">
              {companyJob.companyLogo ? (
                <img
                  src={companyJob.companyLogo}
                  alt={companyJob.company}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                getCompanyInitials(companyJob.company)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {companyJob.company}
            </h1>
            <p className="text-xl text-muted-foreground mb-4 font-medium">
              {companyJob.companyInfo.description || 'Building the Next Generation AI Models for Enterprises'}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {companyJob.location.split(',')[0]}
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {followersCount > 0 ? followersCount.toLocaleString() : companyJob.companyInfo.followers.toLocaleString()} followers
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span>{companyJob.companyInfo.employees}</span>
              <span className="text-muted-foreground/60">•</span>
              <span>{companyJob.companyInfo.industry}</span>
              {companyJob.companyInfo.website && (
                <>
                  <span className="text-muted-foreground/60">•</span>
                  <a
                    href={companyJob.companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <LinkIcon className="w-3 h-3" />
                    Website
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {connectionStatus === 'connected' ? (
              <Button
                variant="outline"
                className="border-success text-success hover:bg-success/10"
              >
                <Check className="w-4 h-4 mr-2" />
                Connected
              </Button>
            ) : connectionStatus === 'pending' ? (
              <Button
                variant="outline"
                className="border-warning text-warning hover:bg-warning/10"
                onClick={handleConnect}
                title="Click to withdraw connection request"
              >
                <Clock className="w-4 h-4 mr-2" />
                Pending
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleConnect}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
            <Button variant="outline" size="icon" title="Message">
              <MessageSquare className="w-4 h-4" />
            </Button>
            {companyJob.companyInfo.website && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(companyJob.companyInfo.website, '_blank')}
                title="Visit website"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" title="More options">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-border -mx-6 px-6">
          <button
            onClick={() => setActiveTab('home')}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'home'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Home
            {activeTab === 'home' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'about'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            About
            {activeTab === 'about' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'posts'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Posts
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('jobs');
              router.push(`/portal/student/jobs?company=${encodeURIComponent(companyJob.company)}`);
            }}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'jobs'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Jobs
            {activeTab === 'jobs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'people'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            People
            {activeTab === 'people' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        {/* Home Tab Content */}
        {activeTab === 'home' && (
          <>
            {/* Overview Section */}
            <Card className="mb-6 border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-foreground">
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed mb-4">
                  {companyJob.companyInfo.description || 'At ' + companyJob.company + ', we are transforming the future of enterprise AI by building responsible, sustainable, and cost-effective AI models tailored for industry-specific challenges—from healthcare to finance. We\'re not just another IT services company. We are an AI product company, creating advanced models and autonomous agents.'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{followersCount > 0 ? followersCount.toLocaleString() : companyJob.companyInfo.followers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{mockJobs.filter(j => j.company === companyName).length}</div>
                    <div className="text-sm text-muted-foreground">Open Jobs</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{posts.length}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 dark:text-foreground">{companyJob.companyInfo.industry}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Industry</div>
                  </div>
                </div>
                <button className="text-sm text-primary dark:text-primary mt-4 hover:underline font-medium">
                  Show all details →
                </button>
              </CardContent>
            </Card>

            {/* Page Posts Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">
                  Page posts
                </h2>
                {posts.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevPost}
                      disabled={currentPostIndex === 0}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentPostIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-slate-100 dark:hover:bg-secondary"
                      )}
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {currentPostIndex + 1} / {posts.length}
                    </span>
                    <button
                      onClick={nextPost}
                      disabled={currentPostIndex === posts.length - 1}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentPostIndex === posts.length - 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-slate-100 dark:hover:bg-secondary"
                      )}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {posts.length === 0 ? (
                  <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">No posts available</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                          {getCompanyInitials(companyJob.company)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900 dark:text-foreground">
                              {companyJob.company}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {companyJob.companyInfo.followers.toLocaleString()} followers
                            </span>
                            <span className="text-muted-foreground/60">•</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {formatTimeAgo(posts[currentPostIndex]?.postedAt || '')}
                            </span>
                          </div>
                          {companyJob.companyInfo.website && (
                            <button className="text-sm text-primary dark:text-primary hover:underline">
                              Visit website
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                          {posts[currentPostIndex]?.content}
                        </p>
                      </div>

                      {posts[currentPostIndex]?.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={posts[currentPostIndex]?.image}
                            alt="Post"
                            className="w-full h-auto"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-border">
                        <button 
                          onClick={() => handleLikePost(posts[currentPostIndex]?.id || '')}
                          className={cn(
                            "flex items-center gap-2 transition-colors",
                            likedPosts.has(posts[currentPostIndex]?.id || '')
                              ? "text-primary dark:text-primary"
                              : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
                          )}
                        >
                          <ThumbsUp className={cn("w-5 h-5", likedPosts.has(posts[currentPostIndex]?.id || '') && "fill-current")} />
                          <span className="text-sm">{postLikes[posts[currentPostIndex]?.id || ''] || posts[currentPostIndex]?.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{posts[currentPostIndex]?.comments || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                          <Repeat2 className="w-5 h-5" />
                          <span className="text-sm">{posts[currentPostIndex]?.reposts || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors ml-auto">
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {/* About Tab Content */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-foreground">
                  About {companyJob.company}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  {companyJob.companyInfo.description || 'At ' + companyJob.company + ', we are transforming the future of enterprise AI by building responsible, sustainable, and cost-effective AI models tailored for industry-specific challenges—from healthcare to finance. We\'re not just another IT services company. We are an AI product company, creating advanced models and autonomous agents.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-foreground mb-2">Industry</h3>
                    <p className="text-slate-600 dark:text-slate-400">{companyJob.companyInfo.industry}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-foreground mb-2">Company Size</h3>
                    <p className="text-slate-600 dark:text-slate-400">{companyJob.companyInfo.employees}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-foreground mb-2">Location</h3>
                    <p className="text-slate-600 dark:text-slate-400">{companyJob.location}</p>
                  </div>
                  {companyJob.companyInfo.website && (
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-foreground mb-2">Website</h3>
                      <a
                        href={companyJob.companyInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {companyJob.companyInfo.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-foreground">
                  Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {companyJob.requirements?.slice(0, 5).map((req: string, idx: number) => (
                    <Badge key={idx} variant="default" className="text-sm border border-slate-300 dark:border-slate-600">
                      {req}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Posts Tab Content */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No posts available</p>
                </CardContent>
              </Card>
            ) : (
              posts.map(post => (
                <Card key={post.id} className="border-slate-200 dark:border-border bg-card dark:bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                        {getCompanyInitials(companyJob.company)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900 dark:text-foreground">
                            {companyJob.company}
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {companyJob.companyInfo.followers.toLocaleString()} followers
                          </span>
                          <span className="text-muted-foreground/60">•</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {formatTimeAgo(post.postedAt)}
                          </span>
                        </div>
                        {companyJob.companyInfo.website && (
                          <button className="text-sm text-primary dark:text-primary hover:underline">
                            Visit website
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt="Post"
                          className="w-full h-auto"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-border">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={cn(
                          "flex items-center gap-2 transition-colors",
                          likedPosts.has(post.id)
                            ? "text-primary dark:text-primary"
                            : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
                        )}
                      >
                        <ThumbsUp className={cn("w-5 h-5", likedPosts.has(post.id) && "fill-current")} />
                        <span className="text-sm">{postLikes[post.id] || post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <Repeat2 className="w-5 h-5" />
                        <span className="text-sm">{post.reposts}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors ml-auto">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Jobs Tab Content */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Open Positions at {companyJob.company}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.filter(j => j.company === companyName).map(jobItem => (
                    <div
                      key={jobItem.id}
                      onClick={() => router.push(`/portal/student/jobs?jobId=${jobItem.id}`)}
                      className="p-4 border border-slate-200 dark:border-border rounded-lg hover:bg-slate-50 dark:hover:bg-secondary cursor-pointer transition-colors"
                    >
                      <h3 className="font-semibold text-slate-900 dark:text-foreground mb-1">{jobItem.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{jobItem.location}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="default" className="border border-slate-300 dark:border-slate-600">{jobItem.type}</Badge>
                        {jobItem.remote && <Badge variant="default" className="border border-slate-300 dark:border-slate-600">Remote</Badge>}
                        {jobItem.salary && <Badge variant="default" className="border border-slate-300 dark:border-slate-600">{jobItem.salary}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* People Tab Content */}
        {activeTab === 'people' && (
          <div className="space-y-4">
          <Card className="border-slate-200 dark:border-border bg-card dark:bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-foreground flex items-center gap-2">
                <Users className="w-5 h-5" />
                People at {companyJob.company}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(mockEmployees[companyName] || []).map(employee => {
                    const status = employeeConnections[employee.id] || employee.connectionStatus;
                    const getInitials = (name: string) => {
                      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    };
                    
                    return (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-4 border border-slate-200 dark:border-border rounded-lg hover:bg-slate-50 dark:hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold text-lg">
                            {employee.avatar ? (
                              <img src={employee.avatar} alt={employee.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              getInitials(employee.name)
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-foreground mb-1">
                              {employee.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                              {employee.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              {employee.location && (
                                <>
                                  <MapPin className="w-3 h-3" />
                                  <span>{employee.location}</span>
                                </>
                              )}
                              {employee.mutualConnections && (
                                <>
                                  <span className="text-muted-foreground/60">•</span>
                                  <span>{employee.mutualConnections} mutual connections</span>
                                </>
                              )}
                              {employee.connectionLevel !== 'outside' && (
                                <>
                                  <span className="text-muted-foreground/60">•</span>
                                  <Badge variant="default" className="text-xs border border-slate-300 dark:border-slate-600">
                                    {employee.connectionLevel} connection
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {status === 'connected' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-500 text-green-600 dark:text-green-400"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Connected
                            </Button>
                          ) : status === 'pending' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-warning text-warning"
                              onClick={() => {
                                setEmployeeConnections(prev => ({ ...prev, [employee.id]: 'not-connected' }));
                              }}
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Pending
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setEmployeeConnections(prev => ({ ...prev, [employee.id]: 'pending' }));
                              }}
                              className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {(!mockEmployees[companyName] || mockEmployees[companyName].length === 0) && (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-2">No employees found</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Connect with employees and alumni from {companyJob.company}
                </p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
          </div>
        )}
      </div>

      {/* Withdraw Connection Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Connection Request"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to withdraw your connection request to {companyJob.company}? You can send a new request later.
          </p>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-border">
            <Button
              variant="outline"
              onClick={() => setShowWithdrawModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleWithdrawConnection}
              className="flex-1 bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white"
            >
              Withdraw Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* Connect Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => {
          setShowConnectModal(false);
          setConnectNote('');
          setNoteError('');
        }}
        title="Connect with Company"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-secondary rounded-lg">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold text-xl">
              {getCompanyInitials(companyJob.company)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-foreground">{companyJob.company}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{companyJob.companyInfo.industry}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-foreground mb-2">
              Add a note <span className="text-red-500">*</span>
            </label>
            <textarea
              value={connectNote}
              onChange={e => {
                setConnectNote(e.target.value);
                if (noteError) setNoteError('');
              }}
              placeholder="Hi! I'm interested in learning more about your company and opportunities..."
              rows={4}
              className={cn(
                "w-full px-3 py-2 border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors",
                noteError
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  : "border-slate-300 dark:border-border focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
              )}
            />
            {noteError ? (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                {noteError}
              </p>
            ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A personalized note increases the chance of your request being accepted (minimum 10 characters)
            </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-border">
            <Button
              variant="outline"
              onClick={() => {
                setShowConnectModal(false);
                setConnectNote('');
                setNoteError('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitConnect}
              disabled={!connectNote.trim() || connectNote.trim().length < 10}
              className={cn(
                "flex-1 bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white",
                (!connectNote.trim() || connectNote.trim().length < 10) && "opacity-50 cursor-not-allowed"
              )}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

