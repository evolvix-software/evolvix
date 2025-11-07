"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, AdminUser, AdminStats, CreateUserRequest, VerificationData } from '@/lib/api';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import {
  Users,
  Shield,
  Ban,
  UserCheck,
  UserX,
  Search,
  MoreVertical,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  LayoutDashboard,
  UserPlus,
  FileText,
  Eye,
  AlertCircle,
} from 'lucide-react';

type View = 'dashboard' | 'users' | 'verifications';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Verifications state
  const [verifications, setVerifications] = useState<VerificationData[]>([]);
  const [verificationsLoading, setVerificationsLoading] = useState(false);
  const [verificationsPage, setVerificationsPage] = useState(1);
  const [verificationsTotalPages, setVerificationsTotalPages] = useState(1);
  const [verificationStatusFilter, setVerificationStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'incomplete' | ''>('');
  const [verificationRoleFilter, setVerificationRoleFilter] = useState<'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur' | ''>('');
  const [selectedVerification, setSelectedVerification] = useState<VerificationData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Create user form state
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    fullName: '',
    email: '',
    password: '',
    roles: [],
    primaryRole: undefined,
    isEmailVerified: false,
    isActive: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await adminApi.verifyToken();
        setAdminUser(user);
        loadStats();
        loadUsers();
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (adminUser && currentView === 'users') {
      loadUsers();
    }
  }, [page, statusFilter, roleFilter, adminUser, currentView]);

  useEffect(() => {
    if (adminUser && currentView === 'verifications') {
      loadVerifications();
    }
  }, [verificationsPage, verificationStatusFilter, verificationRoleFilter, adminUser, currentView]);

  const loadStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await adminApi.getUsers({
        page,
        limit: 20,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        role: roleFilter || undefined,
      });
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const loadVerifications = async () => {
    setVerificationsLoading(true);
    try {
      const response = await adminApi.getVerifications({
        page: verificationsPage,
        limit: 20,
        status: verificationStatusFilter ? (verificationStatusFilter as 'pending' | 'approved' | 'rejected' | 'incomplete') : undefined,
        role: verificationRoleFilter ? (verificationRoleFilter as 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur') : undefined,
      });
      setVerifications(response.verifications);
      setVerificationsTotalPages(response.pagination.pages);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load verifications');
    } finally {
      setVerificationsLoading(false);
    }
  };

  const handleApproveVerification = async (id: string) => {
    setActionLoading(`approve-${id}`);
    setError('');
    try {
      await adminApi.approveVerification(id, { adminNotes: adminNotes || undefined });
      await loadVerifications();
      setShowVerificationModal(false);
      setAdminNotes('');
      alert('Verification approved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to approve verification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectVerification = async (id: string) => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    setActionLoading(`reject-${id}`);
    setError('');
    try {
      await adminApi.rejectVerification(id, {
        rejectionReason,
        adminNotes: adminNotes || undefined,
      });
      await loadVerifications();
      setShowVerificationModal(false);
      setRejectionReason('');
      setAdminNotes('');
      alert('Verification rejected successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to reject verification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async () => {
    setActionLoading('create');
    setError('');
    try {
      const newUser = await adminApi.createUser(createForm);
      setUsers(prev => [newUser, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        fullName: '',
        email: '',
        password: '',
        roles: [],
        primaryRole: undefined,
        isEmailVerified: false,
        isActive: true,
      });
      loadStats();
      alert('User created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    setActionLoading(`${action}-${userId}`);
    setError('');
    try {
      let updatedUser: AdminUser;
      switch (action) {
        case 'ban':
          updatedUser = await adminApi.banUser(userId, reason);
          break;
        case 'unban':
          updatedUser = await adminApi.unbanUser(userId);
          break;
        case 'suspend':
          updatedUser = await adminApi.suspendUser(userId, reason);
          break;
        case 'unsuspend':
          updatedUser = await adminApi.unsuspendUser(userId);
          break;
        case 'activate':
          updatedUser = await adminApi.activateUser(userId);
          break;
        case 'deactivate':
          updatedUser = await adminApi.deactivateUser(userId);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await adminApi.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId && u._id !== userId));
            loadStats();
            setShowUserModal(false);
            return;
          }
          return;
        default:
          throw new Error('Invalid action');
      }
      setUsers(prev => prev.map(u => (u.id === userId || u._id === userId ? updatedUser : u)));
      setSelectedUser(updatedUser);
      loadStats();
    } catch (err: any) {
      setError(err.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (user: AdminUser) => {
    if (user.isBanned) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Banned</span>;
    if (user.isSuspended) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Suspended</span>;
    if (user.isActive) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</span>;
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Inactive</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      title="Admin Portal" 
      role="admin" 
      currentView={currentView}
      adminUser={adminUser ? { fullName: adminUser.fullName, email: adminUser.email } : undefined}
      onViewChange={(view) => {
        if (view === 'dashboard') setCurrentView('dashboard');
        if (view === 'users') setCurrentView('users');
        if (view === 'verifications') {
          setCurrentView('verifications');
          loadVerifications();
        }
      }}
    >
      <div className="space-y-6">
        {/* View Toggle - Only show if not using sidebar navigation */}
        <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4 lg:hidden">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            User Management
          </button>
          <button
            onClick={() => {
              setCurrentView('verifications');
              loadVerifications();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'verifications'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Verifications
          </button>
        </div>

        {currentView === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeUsers}</p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Banned Users</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">{stats.bannedUsers}</p>
                    </div>
                    <Ban className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Users</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{stats.verifiedUsers}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <Button onClick={() => setShowCreateModal(true)}>
                <UserPlus className="w-4 h-4 mr-2" /> Create User
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                  <option value="suspended">Suspended</option>
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="employer">Employer</option>
                  <option value="investor">Investor</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="entrepreneur">Entrepreneur</option>
                </select>
              </div>
              <Button onClick={handleSearch} className="mt-4">Apply Filters</Button>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {usersLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-6 text-center text-gray-600 dark:text-gray-400">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Roles</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id || user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.roles.join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1 || usersLoading}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages || usersLoading}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'verifications' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verification Management</h1>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={verificationStatusFilter}
                  onChange={(e) => setVerificationStatusFilter(e.target.value as 'pending' | 'approved' | 'rejected' | 'incomplete' | '')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="incomplete">Incomplete</option>
                </select>
                <select
                  value={verificationRoleFilter}
                  onChange={(e) => setVerificationRoleFilter(e.target.value as 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur' | '')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="employer">Employer</option>
                  <option value="investor">Investor</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="entrepreneur">Entrepreneur</option>
                </select>
              </div>
              <Button onClick={() => { setVerificationsPage(1); loadVerifications(); }} className="mt-4">Apply Filters</Button>
            </div>

            {/* Verifications Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {verificationsLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading verifications...</p>
                </div>
              ) : verifications.length === 0 ? (
                <div className="p-6 text-center text-gray-600 dark:text-gray-400">No verifications found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {verifications.map((verification) => {
                        const user = typeof verification.userId === 'object' ? verification.userId : null;
                        const userName = user?.fullName || 'Unknown';
                        const userEmail = user?.email || 'Unknown';
                        return (
                          <tr key={verification._id || verification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${userName}&background=random`}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{userName}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                              {verification.role}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              Level {verification.verificationLevel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {verification.status === 'pending' && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</span>
                              )}
                              {verification.status === 'approved' && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</span>
                              )}
                              {verification.status === 'rejected' && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</span>
                              )}
                              {verification.status === 'incomplete' && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Incomplete</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {verification.submittedAt ? new Date(verification.submittedAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const fullVerification = await adminApi.getVerificationById(verification._id || verification.id || '');
                                    setSelectedVerification(fullVerification);
                                    setShowVerificationModal(true);
                                  } catch (err: any) {
                                    setError(err.message || 'Failed to load verification details');
                                  }
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {verificationsTotalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => setVerificationsPage(prev => Math.max(1, prev - 1))}
                    disabled={verificationsPage === 1 || verificationsLoading}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {verificationsPage} of {verificationsTotalPages}
                  </span>
                  <Button
                    onClick={() => setVerificationsPage(prev => Math.min(verificationsTotalPages, prev + 1))}
                    disabled={verificationsPage === verificationsTotalPages || verificationsLoading}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Verification Details Modal */}
      {showVerificationModal && selectedVerification && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Verification Details</h3>
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="space-y-6 mb-6">
              {/* User Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">User Information</h4>
                {typeof selectedVerification.userId === 'object' && selectedVerification.userId ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p><strong>Name:</strong> {selectedVerification.userId.fullName}</p>
                    <p><strong>Email:</strong> {selectedVerification.userId.email}</p>
                    <p><strong>Role:</strong> {selectedVerification.userId.primaryRole || selectedVerification.userId.roles.join(', ')}</p>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">User ID: {selectedVerification.userId}</p>
                )}
              </div>

              {/* Verification Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Verification Information</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                  <p><strong>Role:</strong> {selectedVerification.role}</p>
                  <p><strong>Level:</strong> {selectedVerification.verificationLevel}</p>
                  <p><strong>Status:</strong> 
                    {selectedVerification.status === 'pending' && <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Pending</span>}
                    {selectedVerification.status === 'approved' && <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Approved</span>}
                    {selectedVerification.status === 'rejected' && <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Rejected</span>}
                    {selectedVerification.status === 'incomplete' && <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Incomplete</span>}
                  </p>
                  <p><strong>Submitted:</strong> {selectedVerification.submittedAt ? new Date(selectedVerification.submittedAt).toLocaleString() : 'N/A'}</p>
                  {selectedVerification.reviewedAt && (
                    <p><strong>Reviewed:</strong> {new Date(selectedVerification.reviewedAt).toLocaleString()}</p>
                  )}
                  {selectedVerification.rejectionReason && (
                    <p><strong>Rejection Reason:</strong> {selectedVerification.rejectionReason}</p>
                  )}
                  {selectedVerification.adminNotes && (
                    <p><strong>Admin Notes:</strong> {selectedVerification.adminNotes}</p>
                  )}
                </div>
              </div>

              {/* Verification Data */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Verification Documents</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                  {selectedVerification.personalInfo && (
                    <div>
                      <h5 className="font-medium mb-2">Personal Information</h5>
                      <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded overflow-auto">
                        {JSON.stringify(selectedVerification.personalInfo, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedVerification.idProof && (
                    <div>
                      <h5 className="font-medium mb-2">ID Proof</h5>
                      <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded overflow-auto">
                        {JSON.stringify(selectedVerification.idProof, null, 2)}
                      </pre>
                      {selectedVerification.idProof.documentUrl && (
                        <a href={selectedVerification.idProof.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
                          View Document
                        </a>
                      )}
                    </div>
                  )}
                  {selectedVerification.educationInfo && (
                    <div>
                      <h5 className="font-medium mb-2">Education Information</h5>
                      <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded overflow-auto">
                        {JSON.stringify(selectedVerification.educationInfo, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedVerification.professionalCredentials && (
                    <div>
                      <h5 className="font-medium mb-2">Professional Credentials</h5>
                      <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded overflow-auto">
                        {JSON.stringify(selectedVerification.professionalCredentials, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedVerification.experienceProof && (
                    <div>
                      <h5 className="font-medium mb-2">Experience Proof</h5>
                      <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded overflow-auto">
                        {JSON.stringify(selectedVerification.experienceProof, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedVerification.bankDetails && (
                    <div>
                      <h5 className="font-medium mb-2">Bank Details</h5>
                      <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded overflow-auto">
                        {JSON.stringify(selectedVerification.bankDetails, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedVerification.status === 'pending' && (
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Notes (optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Add notes about this verification..."
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApproveVerification(selectedVerification._id || selectedVerification.id || '')}
                    loading={actionLoading === `approve-${selectedVerification._id || selectedVerification.id}`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      rows={2}
                      placeholder="Rejection reason (required)"
                    />
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleRejectVerification(selectedVerification._id || selectedVerification.id || '')}
                      loading={actionLoading === `reject-${selectedVerification._id || selectedVerification.id}`}
                      disabled={!rejectionReason.trim()}
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full mt-4" onClick={() => {
              setShowVerificationModal(false);
              setSelectedVerification(null);
              setRejectionReason('');
              setAdminNotes('');
            }}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Create New User</h3>
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <Input
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password (optional)</label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Leave empty for no password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                <select
                  value={createForm.primaryRole || ''}
                  onChange={(e) => setCreateForm({
                    ...createForm,
                    primaryRole: e.target.value as any,
                    roles: e.target.value ? [e.target.value] : [],
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="employer">Employer</option>
                  <option value="investor">Investor</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="entrepreneur">Entrepreneur</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={createForm.isEmailVerified}
                    onChange={(e) => setCreateForm({ ...createForm, isEmailVerified: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Email Verified</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={createForm.isActive}
                    onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <Button
                onClick={handleCreateUser}
                loading={actionLoading === 'create'}
                disabled={!createForm.fullName || !createForm.email}
                className="flex-1"
              >
                Create User
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User Actions Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Manage User: {selectedUser.fullName}</h3>
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-4 mb-6">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Roles:</strong> {selectedUser.roles.join(', ')}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedUser)}</p>
              {selectedUser.isBanned && <p><strong>Ban Reason:</strong> {selectedUser.banReason || 'N/A'}</p>}
              {selectedUser.isSuspended && <p><strong>Suspend Reason:</strong> {selectedUser.suspendReason || 'N/A'}</p>}
              <p><strong>Last Login:</strong> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'N/A'}</p>
            </div>

            <div className="space-y-3">
              {!selectedUser.isBanned ? (
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleUserAction(selectedUser.id || selectedUser._id, 'ban', prompt('Reason for banning?') || undefined)}
                  loading={actionLoading === `ban-${selectedUser.id || selectedUser._id}`}
                >
                  <Ban className="w-4 h-4 mr-2" /> Ban User
                </Button>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleUserAction(selectedUser.id || selectedUser._id, 'unban')}
                  loading={actionLoading === `unban-${selectedUser.id || selectedUser._id}`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Unban User
                </Button>
              )}

              {!selectedUser.isSuspended ? (
                <Button
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => handleUserAction(selectedUser.id || selectedUser._id, 'suspend', prompt('Reason for suspension?') || undefined)}
                  loading={actionLoading === `suspend-${selectedUser.id || selectedUser._id}`}
                >
                  <Clock className="w-4 h-4 mr-2" /> Suspend User
                </Button>
              ) : (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleUserAction(selectedUser.id || selectedUser._id, 'unsuspend')}
                  loading={actionLoading === `unsuspend-${selectedUser.id || selectedUser._id}`}
                >
                  <UserCheck className="w-4 h-4 mr-2" /> Unsuspend User
                </Button>
              )}

              {selectedUser.isActive ? (
                <Button
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                  onClick={() => handleUserAction(selectedUser.id || selectedUser._id, 'deactivate')}
                  loading={actionLoading === `deactivate-${selectedUser.id || selectedUser._id}`}
                >
                  <UserX className="w-4 h-4 mr-2" /> Deactivate User
                </Button>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleUserAction(selectedUser.id || selectedUser._id, 'activate')}
                  loading={actionLoading === `activate-${selectedUser.id || selectedUser._id}`}
                >
                  <UserCheck className="w-4 h-4 mr-2" /> Activate User
                </Button>
              )}

              <Button
                className="w-full bg-red-800 hover:bg-red-900 text-white"
                onClick={() => handleUserAction(selectedUser.id || selectedUser._id, 'delete')}
                loading={actionLoading === `delete-${selectedUser.id || selectedUser._id}`}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete User
              </Button>

              <Button variant="outline" className="w-full" onClick={() => setShowUserModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
