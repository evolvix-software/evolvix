"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, AdminUser, AdminStats, CreateUserRequest, VerificationData } from '@/lib/api';
import { Layout } from '@/components/common/layout/Layout';
import {
  DashboardView,
  ViewToggle,
  UsersManagement,
  VerificationsManagement,
  CreateUserModal,
  UserActionsModal,
  VerificationDetailsModal,
} from './components';

type View = 'dashboard' | 'users' | 'verifications';

export function AdminDashboardPage() {
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

  const handleApproveVerification = async (id: string, adminNotes?: string) => {
    setActionLoading(`approve-${id}`);
    setError('');
    try {
      await adminApi.approveVerification(id, { adminNotes });
      await loadVerifications();
      setShowVerificationModal(false);
      alert('Verification approved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to approve verification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectVerification = async (id: string, rejectionReason: string, adminNotes?: string) => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    setActionLoading(`reject-${id}`);
    setError('');
    try {
      await adminApi.rejectVerification(id, {
        rejectionReason,
        adminNotes,
      });
      await loadVerifications();
      setShowVerificationModal(false);
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

  const handleVerificationSelect = async (verification: VerificationData) => {
    try {
      const fullVerification = await adminApi.getVerificationById(verification._id || verification.id || '');
      setSelectedVerification(fullVerification);
      setShowVerificationModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load verification details');
    }
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
        <ViewToggle
          currentView={currentView}
          onViewChange={setCurrentView}
          onVerificationsClick={() => {
            setCurrentView('verifications');
            loadVerifications();
          }}
        />

        {currentView === 'dashboard' && <DashboardView stats={stats} />}

        {currentView === 'users' && (
          <UsersManagement
            users={users}
            usersLoading={usersLoading}
            page={page}
            totalPages={totalPages}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            onSearch={handleSearch}
            onSearchQueryChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onRoleFilterChange={setRoleFilter}
            onPageChange={setPage}
            onCreateUser={() => setShowCreateModal(true)}
            onUserSelect={(user) => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
            getStatusBadge={getStatusBadge}
          />
        )}

        {currentView === 'verifications' && (
          <VerificationsManagement
            verifications={verifications}
            verificationsLoading={verificationsLoading}
            verificationsPage={verificationsPage}
            verificationsTotalPages={verificationsTotalPages}
            verificationStatusFilter={verificationStatusFilter}
            verificationRoleFilter={verificationRoleFilter}
            onStatusFilterChange={setVerificationStatusFilter}
            onRoleFilterChange={setVerificationRoleFilter}
            onPageChange={setVerificationsPage}
            onLoadVerifications={() => {
              setVerificationsPage(1);
              loadVerifications();
            }}
            onVerificationSelect={handleVerificationSelect}
          />
        )}
      </div>

      <CreateUserModal
        show={showCreateModal}
        createForm={createForm}
        error={error}
        loading={actionLoading === 'create'}
        onClose={() => {
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
        }}
        onCreate={handleCreateUser}
        onFormChange={setCreateForm}
      />

      <UserActionsModal
        show={showUserModal}
        user={selectedUser}
        error={error}
        actionLoading={actionLoading}
        getStatusBadge={getStatusBadge}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        onAction={handleUserAction}
      />

      <VerificationDetailsModal
        show={showVerificationModal}
        verification={selectedVerification}
        error={error}
        actionLoading={actionLoading}
        onClose={() => {
          setShowVerificationModal(false);
          setSelectedVerification(null);
        }}
        onApprove={handleApproveVerification}
        onReject={handleRejectVerification}
      />
    </Layout>
  );
}

