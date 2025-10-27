"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadVerificationData, checkVerificationStatus } from '@/store/features/verification/verificationThunks';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { VerificationLevel } from '@/components/verification/VerificationLevel';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Save,
  X
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { 
    currentVerification, 
    verificationStatus, 
    isLoading: verificationLoading 
  } = useAppSelector((state) => state.verification);
  
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get stored registration data
    const storedData = localStorage.getItem('evolvix_registration');
    console.log('Profile page - stored data:', storedData);
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('Profile page - parsed data:', parsedData);
      
      if (parsedData.status === 'completed' && parsedData.role) {
        setUserData(parsedData);
        setEditedData(parsedData);
        
        // Load verification data
        dispatch(loadVerificationData(parsedData.email));
        dispatch(checkVerificationStatus(parsedData.email));
      } else {
        console.log('Registration not completed, redirecting to role selection');
        router.push('/auth/role-selection');
      }
    } else {
      console.log('No registration data found, redirecting to signup');
      router.push('/auth/signup');
    }
  }, [router, dispatch]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update user data
      const updatedData = { ...userData, ...editedData };
      localStorage.setItem('evolvix_registration', JSON.stringify(updatedData));
      setUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleTitle = (role: string) => {
    const titles = {
      student: 'Student',
      mentor: 'Mentor',
      employer: 'Employer',
      investor: 'Investor',
      sponsor: 'Sponsor'
    };
    return titles[role as keyof typeof titles] || role;
  };

  const getVerificationStatusIcon = () => {
    if (!verificationStatus) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    
    switch (verificationStatus.status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getVerificationStatusText = () => {
    if (!verificationStatus) return 'Not Started';
    
    switch (verificationStatus.status) {
      case 'approved':
        return 'Verified';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Incomplete';
    }
  };

  const getVerificationStatusColor = () => {
    if (!verificationStatus) return 'text-gray-600 dark:text-gray-400';
    
    switch (verificationStatus.status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-orange-600 dark:text-orange-400';
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <StudentLayout title="Profile">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and verification status
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Basic Information</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Your personal account details
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEdit}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedData.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{userData.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Email
                    </label>
                    <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{userData.phone || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Role
                    </label>
                    <p className="text-gray-600 dark:text-gray-400">{getRoleTitle(userData.role)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Registration Date
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(userData.registrationDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Verification Status</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your account verification level and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getVerificationStatusIcon()}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Verification Status
                        </h4>
                        <p className={`text-sm ${getVerificationStatusColor()}`}>
                          {getVerificationStatusText()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Level {verificationStatus?.level || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {verificationStatus?.level === 0 ? 'Basic Access' :
                         verificationStatus?.level === 1 ? 'Identity Verified' :
                         verificationStatus?.level === 2 ? 'Full Access' : 'Limited Access'}
                      </p>
                    </div>
                  </div>

                  {verificationStatus?.status === 'incomplete' && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-orange-900 dark:text-orange-400">
                            Verification Required
                          </h4>
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            Complete your verification to unlock all portal features and become a verified person.
                          </p>
                        </div>
                        <Button
                          onClick={() => router.push('/portal/verification')}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Verify Now
                        </Button>
                      </div>
                    </div>
                  )}

                  {verificationStatus?.status === 'pending' && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <h4 className="font-semibold text-yellow-900 dark:text-yellow-400">
                            Under Review
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Your verification is being reviewed. You'll be notified once it's complete.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {verificationStatus?.status === 'rejected' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-900 dark:text-red-400">
                            Verification Rejected
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Your verification was rejected. Please review the requirements and submit again.
                          </p>
                        </div>
                        <Button
                          onClick={() => router.push('/portal/verification')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Resubmit
                        </Button>
                      </div>
                    </div>
                  )}

                  {verificationStatus?.status === 'approved' && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-400">
                            Verification Complete
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Congratulations! You are now a verified person with full portal access.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Verification Level */}
          <div className="space-y-6">
            <VerificationLevel 
              currentLevel={verificationStatus?.level || 0} 
              status={verificationStatus?.status || 'incomplete'} 
              role={userData.role} 
            />

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Common profile tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/portal/verification')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {verificationStatus?.status === 'incomplete' ? 'Start Verification' : 'Update Verification'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/portal/${userData.role}`)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Back to Portal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

