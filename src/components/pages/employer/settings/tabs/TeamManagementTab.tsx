"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { 
  Plus, 
  Mail, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Send,
  User,
  Shield,
  Eye
} from 'lucide-react';
import { TeamMember, Permission } from '../types';
import { cn } from '@/utils';

interface TeamManagementTabProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

const permissions: Array<{ id: Permission; label: string }> = [
  { id: 'post_jobs', label: 'Post Jobs' },
  { id: 'manage_jobs', label: 'Manage Jobs' },
  { id: 'view_applicants', label: 'View Applicants' },
  { id: 'manage_applicants', label: 'Manage Applicants' },
  { id: 'manage_career_page', label: 'Manage Career Page' },
  { id: 'view_analytics', label: 'View Analytics' },
  { id: 'manage_team', label: 'Manage Team' },
  { id: 'manage_billing', label: 'Manage Billing' },
  { id: 'manage_settings', label: 'Manage Settings' },
];

const rolePermissions: Record<string, Permission[]> = {
  admin: ['post_jobs', 'manage_jobs', 'view_applicants', 'manage_applicants', 'manage_career_page', 'view_analytics', 'manage_team', 'manage_billing', 'manage_settings'],
  recruiter: ['post_jobs', 'manage_jobs', 'view_applicants', 'manage_applicants', 'view_analytics'],
  viewer: ['view_applicants', 'view_analytics'],
};

export function TeamManagementTab({ onUnsavedChanges }: TeamManagementTabProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@techcorp.com',
      role: 'admin',
      status: 'active',
      permissions: rolePermissions.admin,
      lastActive: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@techcorp.com',
      role: 'recruiter',
      status: 'active',
      permissions: rolePermissions.recruiter,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@techcorp.com',
      role: 'viewer',
      status: 'pending',
      invitedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      permissions: rolePermissions.viewer,
    },
  ]);

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    role: 'recruiter' as 'admin' | 'recruiter' | 'viewer',
  });

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleInvite = () => {
    if (!inviteData.email) {
      alert('Please enter an email address');
      return;
    }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role,
      status: 'pending',
      permissions: rolePermissions[inviteData.role],
      invitedAt: new Date().toISOString(),
    };
    setTeamMembers([...teamMembers, newMember]);
    setInviteData({ email: '', name: '', role: 'recruiter' });
    setShowInviteDialog(false);
    onUnsavedChanges?.(true);
    alert('Invitation sent successfully!');
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
      onUnsavedChanges?.(true);
    }
  };

  const handleResendInvite = (id: string) => {
    alert('Invitation resent successfully!');
  };

  const handleRoleChange = (memberId: string, newRole: 'admin' | 'recruiter' | 'viewer') => {
    setTeamMembers(teamMembers.map(m => 
      m.id === memberId 
        ? { ...m, role: newRole, permissions: rolePermissions[newRole] }
        : m
    ));
    onUnsavedChanges?.(true);
  };

  const handlePermissionToggle = (memberId: string, permission: Permission) => {
    setTeamMembers(teamMembers.map(m => {
      if (m.id === memberId) {
        const hasPermission = m.permissions.includes(permission);
        return {
          ...m,
          permissions: hasPermission
            ? m.permissions.filter(p => p !== permission)
            : [...m.permissions, permission]
        };
      }
      return m;
    }));
    onUnsavedChanges?.(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'recruiter':
        return <User className="w-4 h-4" />;
      case 'viewer':
        return <Eye className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Team Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team members and their permissions
          </p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Invite Team Member
        </Button>
      </div>

      {/* Invite Dialog */}
      {showInviteDialog && (
        <Card className="border-primary border-2">
          <CardHeader>
            <CardTitle>Invite Team Member</CardTitle>
            <CardDescription>Send an invitation to join your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                placeholder="colleague@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
              <Input
                value={inviteData.name}
                onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Role <span className="text-destructive">*</span>
              </label>
              <select
                value={inviteData.role}
                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="admin">Admin - Full access</option>
                <option value="recruiter">Recruiter - Limited access</option>
                <option value="viewer">Viewer - Read-only</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInvite} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <Badge variant={member.status === 'active' ? 'primary' : 'default'}>
                          {member.status === 'active' ? 'Active' : 'Pending'}
                        </Badge>
                        <Badge variant="default" className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      {member.lastActive && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last active: {new Date(member.lastActive).toLocaleString()}
                        </p>
                      )}
                      {member.invitedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Invited: {new Date(member.invitedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Permissions */}
                  {editingMember?.id === member.id && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                        >
                          <option value="admin">Admin</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Permissions</label>
                        <div className="grid md:grid-cols-2 gap-2">
                          {permissions.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={member.permissions.includes(perm.id)}
                                onCheckedChange={() => handlePermissionToggle(member.id, perm.id)}
                              />
                              <span className="text-sm text-foreground">{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {member.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendInvite(member.id)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Resend
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMember(editingMember?.id === member.id ? null : member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

