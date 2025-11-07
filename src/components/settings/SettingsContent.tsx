"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  updatePersonalInfo, 
  updateEducationInfo, 
  addSkill, 
  removeSkill, 
  addInterest, 
  removeInterest, 
  updateKYCStatus,
  updateNotifications,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  updatePreferences,
  updatePrivacySettings,
  setTwoFactorAuth
} from '@/store/features/profile/profileSlice';
import { MentorVerificationForm } from '@/components/verification';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Lock,
  CreditCard,
  Bell,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Link as LinkIcon,
  Trash2,
  Download,
  LogOut,
  Globe,
  Sun,
  Moon,
  Upload,
  Image as ImageIcon,
  GraduationCap,
  Award,
  Briefcase,
  FileText,
  TrendingUp,
  Eye as EyeIcon,
  Settings,
  Palette,
  Languages,
  Layout,
  Home,
  Volume2,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  ExternalLink,
  Trash,
  Building2,
  DollarSign,
  Receipt,
  BookCheck,
  Users,
  Share2,
  HardDrive,
  Power,
  Camera,
  Edit2,
  Save,
  XCircle,
  Github,
  Linkedin,
} from 'lucide-react';

interface SettingsContentProps {
  section?: string;
  role: 'student' | 'mentor';
}

export function SettingsContent({ section, role }: SettingsContentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);
  const { theme, toggleTheme } = useTheme();
  
  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Mentor-specific states
  const [professionalInfo, setProfessionalInfo] = useState({
    bio: '',
    expertise: [] as string[],
    experience: [] as Array<{company: string; years: string; designation: string}>
  });
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
    portfolio: ''
  });
  const [payoutInfo, setPayoutInfo] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    upiId: '',
    pan: '',
    gst: ''
  });
  
  // Personal Info state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    bio: '',
  });

  // Education state
  const [educationInfo, setEducationInfo] = useState({
    college: '',
    degree: '',
    year: '',
    specialization: '',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('evolvix_settings');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Load settings from localStorage if available
      } catch (e) {
        console.error('Error loading settings from localStorage:', e);
      }
    }
  }, []);

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem('evolvix_settings', JSON.stringify({
      personalInfo: profile.personalInfo,
      educationInfo: profile.educationInfo,
      skills: profile.skills,
      interests: profile.interests,
      notifications: profile.notifications,
      paymentMethods: profile.paymentMethods,
      preferences: profile.preferences,
      privacySettings: profile.privacySettings,
      twoFactorAuth: profile.twoFactorAuth,
    }));
  }, [profile]);

  // Load data from Redux store
  useEffect(() => {
    setPersonalInfo({
      firstName: profile.personalInfo.firstName,
      lastName: profile.personalInfo.lastName,
      email: profile.personalInfo.email,
      phone: profile.personalInfo.phone,
      dateOfBirth: profile.personalInfo.dateOfBirth,
      gender: 'Male',
      country: 'India',
      bio: 'A passionate student eager to learn and grow in the tech industry.',
    });

    setEducationInfo({
      college: profile.educationInfo.college,
      degree: profile.educationInfo.degree,
      year: profile.educationInfo.year,
      specialization: profile.educationInfo.specialization,
    });
  }, [profile]);

  const handleSavePersonalInfo = () => {
    dispatch(updatePersonalInfo(personalInfo));
    setIsEditing(false);
    alert('Personal information updated successfully!');
  };

  const handleSaveEducation = () => {
    dispatch(updateEducationInfo(educationInfo));
    alert('Education details updated successfully!');
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(addSkill({ id: Date.now().toString(), name: newSkill, level: 'intermediate' }));
      setNewSkill('');
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      dispatch(addInterest({ id: Date.now().toString(), name: newInterest, category: 'technology' }));
      setNewInterest('');
    }
  };

  const handleRemoveSkill = (id: string) => {
    dispatch(removeSkill(id));
  };

  const handleRemoveInterest = (id: string) => {
    dispatch(removeInterest(id));
  };

  const handleNotificationToggle = (field: keyof typeof profile.notifications, value: boolean) => {
    dispatch(updateNotifications({ [field]: value }));
  };

  const handlePreferenceChange = (field: keyof typeof profile.preferences, value: any) => {
    dispatch(updatePreferences({ [field]: value }));
  };

  const handlePrivacyChange = (field: keyof typeof profile.privacySettings, value: any) => {
    dispatch(updatePrivacySettings({ [field]: value }));
  };

  const handleAddPaymentMethod = () => {
    const newMethod = {
      id: Date.now().toString(),
      type: 'visa' as const,
      last4: '1234',
      expiry: '12/25',
      cardholder: 'John Doe',
      isDefault: false,
    };
    dispatch(addPaymentMethod(newMethod));
    setShowPaymentForm(false);
    alert('Payment method added successfully!');
  };

  const handleRemovePaymentMethod = (id: string) => {
    dispatch(removePaymentMethod(id));
    alert('Payment method removed');
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    dispatch(setDefaultPaymentMethod(id));
    alert('Default payment method updated!');
  };

  const handleToggleTwoFactor = () => {
    dispatch(setTwoFactorAuth(!profile.twoFactorAuth));
  };

  // STUDENT SECTIONS
  if (role === 'student') {
    return (
      <div className="space-y-6">
        {section === 'basic' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-[#635bff]" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Manage your personal details and identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">First Name</label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Last Name</label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Date of Birth</label>
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Gender</label>
                    <select 
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Country</label>
                    <input
                      type="text"
                      value={personalInfo.country}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Bio / About Me</h3>
                <textarea
                  value={personalInfo.bio}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSavePersonalInfo} className="bg-[#635bff] hover:bg-[#4f48cc]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'picture' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-[#635bff]" />
                <span>Profile Picture</span>
              </CardTitle>
              <CardDescription>Upload or update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-[#635bff]">
                  <User className="w-16 h-16 text-slate-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <Button className="bg-[#635bff] hover:bg-[#4f48cc]">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Photo
                  </Button>
                  <p className="text-sm text-slate-600 dark:text-slate-400">JPG, PNG or GIF. Max size 2MB</p>
                  <Button variant="outline">
                    <Trash className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'education' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-[#635bff]" />
                <span>Education Details</span>
              </CardTitle>
              <CardDescription>Manage your educational qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: '1',
                  institution: profile.educationInfo.college || 'University of Technology',
                  degree: profile.educationInfo.degree || 'B.Tech',
                  year: profile.educationInfo.year || '2022',
                  major: profile.educationInfo.specialization || 'Computer Science',
                }
              ].map((edu: any, index: number) => (
                <div key={edu.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{edu.institution}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{edu.degree} - {edu.major}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Year:</span>
                      <span className="ml-2 font-medium text-slate-900 dark:text-white">{edu.year}</span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Trash className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Education Details
              </Button>
            </CardContent>
          </Card>
        )}

        {section === 'skills' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#635bff]" />
                <span>Skills & Interests</span>
              </CardTitle>
              <CardDescription>Add or remove your skills and interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Skills Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map((skill) => (
                    <span key={skill.id} className="px-3 py-1 bg-[#635bff]/10 dark:bg-[#635bff]/20 text-[#635bff] dark:text-[#735fff] rounded-full text-sm flex items-center space-x-2">
                      <span>{skill.name}</span>
                      <XCircle 
                        className="w-3 h-3 cursor-pointer hover:text-red-600" 
                        onClick={() => handleRemoveSkill(skill.id)}
                      />
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <Button onClick={handleAddSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Interests Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.interests.map((interest) => (
                    <span key={interest.id} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center space-x-2">
                      <span>{interest.name}</span>
                      <XCircle 
                        className="w-3 h-3 cursor-pointer hover:text-red-600"
                        onClick={() => handleRemoveInterest(interest.id)}
                      />
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add an interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <Button onClick={handleAddInterest}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'password' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-[#635bff]" />
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <Button className="bg-[#635bff] hover:bg-[#4f48cc]">
                <Save className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        )}

        {section === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#635bff]" />
                <span>Payment Methods</span>
              </CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Saved Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Saved Payment Methods</h3>
                
                {profile.paymentMethods.map((method) => (
                  <div key={method.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-10 rounded-lg flex items-center justify-center shadow-lg ${
                          method.type === 'visa' ? 'bg-gradient-to-br from-blue-600 to-blue-800' :
                          method.type === 'mastercard' ? 'bg-gradient-to-br from-red-600 to-[#635bff]' :
                          'bg-gradient-to-br from-slate-600 to-slate-800'
                        }`}>
                          <span className="text-white font-bold text-xs">{method.type === 'visa' ? 'VISA' : method.type === 'mastercard' ? 'MC' : 'CARD'}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white flex items-center">
                            •••• •••• •••• {method.last4}
                            {method.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full">Default</span>
                            )}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Expires {method.expiry}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">{method.cardholder}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleRemovePaymentMethod(method.id)}>
                        <Trash className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add New Payment Method Button */}
                <Button variant="outline" className="w-full border-dashed" onClick={() => setShowPaymentForm(!showPaymentForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              {/* Payment Method Form */}
              {showPaymentForm && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add New Payment Method</h3>
                
                  <div className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full pl-12 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Billing Address */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Billing Address</label>
                      <input
                        type="text"
                        placeholder="Street address"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white mb-2"
                      />
                      <div className="grid md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Security Note */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-400 flex items-start">
                        <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        Your payment information is encrypted and securely stored. We never store your full card details.
                      </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddPaymentMethod} className="bg-[#635bff] hover:bg-[#4f48cc]">
                        <Save className="w-4 h-4 mr-2" />
                        Save Payment Method
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {section === 'notifications-app' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-[#635bff]" />
                <span>App Notifications</span>
              </CardTitle>
              <CardDescription>Control what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Course Updates', desc: 'Get notified about new courses and lessons', key: 'courseUpdates' as const },
                { name: 'Assignment Deadlines', desc: 'Reminders for upcoming assignments', key: 'assignmentDeadlines' as const },
                { name: 'Mentor Messages', desc: 'When your mentor replies to you', key: 'mentorMessages' as const },
                { name: 'Job Alerts', desc: 'New job opportunities matching your profile', key: 'jobAlerts' as const },
                { name: 'Achievements', desc: 'When you earn badges or complete milestones', key: 'achievements' as const },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={profile.notifications[item.key]}
                      onChange={(e) => handleNotificationToggle(item.key, e.target.checked)}
                    />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#635bff]/30 dark:peer-focus:ring-[#635bff]/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#635bff]"></div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {section === 'preferences' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-[#635bff]" />
                <span>Preferences</span>
              </CardTitle>
              <CardDescription>Customize your app appearance and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Selection */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div onClick={toggleTheme} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition p-2 rounded">
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-[#635bff]" /> : <Sun className="w-5 h-5 text-[#635bff]" />}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Theme</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Currently using {theme} mode</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </Button>
                </div>
              </div>

              {/* Dashboard Layout */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <label className="font-medium text-slate-900 dark:text-white mb-2 block">Dashboard Layout</label>
                <select 
                  value={profile.preferences.dashboardLayout}
                  onChange={(e) => handlePreferenceChange('dashboardLayout', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="minimal">Minimal</option>
                  <option value="detailed">Detailed</option>
                  <option value="compact">Compact</option>
                </select>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Choose your preferred dashboard view</p>
              </div>

              {/* Language Selection */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <label className="font-medium text-slate-900 dark:text-white mb-2 block flex items-center space-x-2">
                  <Languages className="w-4 h-4" />
                  <span>Language</span>
                </label>
                <select 
                  value={profile.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Select your preferred language</p>
              </div>

              {/* Default Home Page */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <label className="font-medium text-slate-900 dark:text-white mb-2 block flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Default Home Page</span>
                </label>
                <select 
                  value={profile.preferences.defaultHomePage}
                  onChange={(e) => handlePreferenceChange('defaultHomePage', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="courses">My Courses</option>
                  <option value="progress">Progress</option>
                  <option value="assignments">Assignments</option>
                </select>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Choose your default landing page</p>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'privacy' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#635bff]" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>Manage your privacy settings and data control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Visibility */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Profile Visibility</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Control who can see your profile</p>
                  </div>
                  <select 
                    value={profile.privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Data Sharing</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Allow analytics and data sharing</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={profile.privacySettings.dataSharing}
                      onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                    />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#635bff]/30 dark:peer-focus:ring-[#635bff]/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#635bff]"></div>
                  </label>
                </div>
              </div>

              {/* Session History */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Active Sessions</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">View and manage your active logins</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Sessions
                  </Button>
                </div>
              </div>

              {/* Download Data */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Download My Data</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Download all your data (GDPR compliant)</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>

              {/* Delete Account */}
              <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-red-700 dark:text-red-400">Delete Account</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-red-300 dark:border-red-700 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'account' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-[#635bff]" />
                <span>Account & Security</span>
              </CardTitle>
              <CardDescription>Manage your login and security credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Two-Factor Authentication */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={profile.twoFactorAuth}
                      onChange={handleToggleTwoFactor}
                    />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#635bff]/30 dark:peer-focus:ring-[#635bff]/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#635bff]"></div>
                  </label>
                </div>
              </div>

              {/* Linked Accounts */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-slate-900 dark:text-white">Linked Accounts</span>
                  <Button variant="outline" size="sm">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Connect Account
                  </Button>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Google</span>
                    <span className="text-green-600">Connected</span>
                  </div>
                </div>
              </div>

              {/* Logout Section */}
              <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-red-700 dark:text-red-400">Sign Out</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Logout from your account</p>
                  </div>
                  <Button 
                    onClick={() => {
                      // Clear all storage
                      localStorage.clear();
                      // Redirect to login
                      window.location.href = '/auth/signin';
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!section && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings Overview</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">Select a section from the sidebar to configure your settings.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // MENTOR SECTIONS
  if (role === 'mentor') {
    return (
    <div className="space-y-6">
      {section === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <span>Profile Settings</span>
            </CardTitle>
            <CardDescription>Manage your professional profile and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Verification Status Card */}
            {(() => {
              const storedData = typeof window !== 'undefined' ? localStorage.getItem('evolvix_registration') : null;
              let verificationStatus: 'incomplete' | 'pending' | 'approved' | 'rejected' = 'incomplete';
              if (storedData) {
                try {
                  const parsedData = JSON.parse(storedData);
                  const verificationKey = `evolvix_mentor_verification_${parsedData.email}`;
                  const verificationData = typeof window !== 'undefined' ? localStorage.getItem(verificationKey) : null;
                  if (verificationData) {
                    const verification = JSON.parse(verificationData);
                    verificationStatus = verification.status || 'incomplete';
                  }
                } catch (e) {
                  // Ignore
                }
              }
              return (
                <Card className={`border-2 ${
                  verificationStatus === 'approved' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : verificationStatus === 'pending'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : verificationStatus === 'rejected'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {verificationStatus === 'approved' ? (
                            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                          ) : verificationStatus === 'pending' ? (
                            <Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                          ) : verificationStatus === 'rejected' ? (
                            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                          ) : (
                            <Shield className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${
                            verificationStatus === 'approved'
                              ? 'text-green-900 dark:text-green-400'
                              : verificationStatus === 'pending'
                              ? 'text-yellow-900 dark:text-yellow-400'
                              : verificationStatus === 'rejected'
                              ? 'text-red-900 dark:text-red-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {verificationStatus === 'approved' 
                              ? 'Verification Complete!' 
                              : verificationStatus === 'pending'
                              ? 'Verification Under Review'
                              : verificationStatus === 'rejected'
                              ? 'Verification Rejected'
                              : 'Verified' /* 'Verification Required' - Commented out for UI development */}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            verificationStatus === 'approved'
                              ? 'text-green-700 dark:text-green-300'
                              : verificationStatus === 'pending'
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : verificationStatus === 'rejected'
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {verificationStatus === 'approved'
                              ? 'You are now a verified mentor with full access to all features.'
                              : verificationStatus === 'pending'
                              ? 'Your verification is being reviewed. You\'ll be notified once it\'s complete.'
                              : verificationStatus === 'rejected'
                              ? 'Your verification was rejected. Please review the requirements and submit again.'
                              : 'You have full access to all features.' /* 'Complete your verification to unlock all mentor features and start earning.' - Commented out for UI development */}
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          router.push('/portal/mentor/settings?section=kyc');
                        }}
                        variant={verificationStatus !== 'approved' ? 'default' : 'outline'}
                        className={verificationStatus !== 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {verificationStatus === 'incomplete' || verificationStatus === 'rejected' 
                          ? 'Complete Verification' 
                          : 'View Status'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Gender</label>
                  <select 
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Date of Birth</label>
                  <input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Country</label>
                  <input
                    type="text"
                    value={personalInfo.country}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Professional Summary</h3>
              <textarea
                value={professionalInfo.bio}
                onChange={(e) => setProfessionalInfo({ ...professionalInfo, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                placeholder="Write a short bio about your expertise and experience..."
              />
            </div>

            {/* Expertise/Skills */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Expertise / Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {professionalInfo.expertise.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm flex items-center space-x-2">
                    <span>{skill}</span>
                    <XCircle 
                      className="w-3 h-3 cursor-pointer hover:text-red-600" 
                      onClick={() => setProfessionalInfo({...professionalInfo, expertise: professionalInfo.expertise.filter((_, i) => i !== idx)})}
                    />
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add expertise/skill..."
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        setProfessionalInfo({...professionalInfo, expertise: [...professionalInfo.expertise, target.value.trim()]});
                        target.value = '';
                      }
                    }
                  }}
                />
                <Button onClick={() => {
                  const input = document.querySelector('input[placeholder="Add expertise/skill..."]') as HTMLInputElement;
                  if (input?.value.trim()) {
                    setProfessionalInfo({...professionalInfo, expertise: [...professionalInfo.expertise, input.value.trim()]});
                    input.value = '';
                  }
                }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Experience</h3>
              {professionalInfo.experience.map((exp, idx) => (
                <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg mb-3">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Company</label>
                      <input 
                        type="text" 
                        value={exp.company} 
                        onChange={(e) => {
                          const updated = [...professionalInfo.experience];
                          updated[idx] = { ...updated[idx], company: e.target.value };
                          setProfessionalInfo({...professionalInfo, experience: updated});
                        }}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Designation</label>
                      <input 
                        type="text" 
                        value={exp.designation} 
                        onChange={(e) => {
                          const updated = [...professionalInfo.experience];
                          updated[idx] = { ...updated[idx], designation: e.target.value };
                          setProfessionalInfo({...professionalInfo, experience: updated});
                        }}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Years</label>
                      <input 
                        type="text" 
                        value={exp.years} 
                        onChange={(e) => {
                          const updated = [...professionalInfo.experience];
                          updated[idx] = { ...updated[idx], years: e.target.value };
                          setProfessionalInfo({...professionalInfo, experience: updated});
                        }}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" 
                      />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                    setProfessionalInfo({...professionalInfo, experience: professionalInfo.experience.filter((_, i) => i !== idx)});
                  }}>
                    <Trash className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => {
                setProfessionalInfo({...professionalInfo, experience: [...professionalInfo.experience, {company: '', designation: '', years: ''}]});
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>

            {/* Profile Picture */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-green-600">
                  <User className="w-16 h-16 text-slate-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-slate-600 dark:text-slate-400">JPG, PNG or GIF. Max size 2MB</p>
                  <Button variant="outline">
                    <Trash className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Social Links</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5 text-gray-900 dark:text-white" />
                  <input
                    type="text"
                    placeholder="GitHub URL"
                    value={socialLinks.github}
                    onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <input
                    type="text"
                    placeholder="Portfolio URL"
                    value={socialLinks.portfolio}
                    onChange={(e) => setSocialLinks({...socialLinks, portfolio: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => alert('Profile settings saved!')} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {section === 'kyc' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>KYC & Verification</span>
            </CardTitle>
            <CardDescription>Manage your KYC & Verification settings</CardDescription>
            {/* <CardDescription>Complete your verification to unlock all mentor features</CardDescription> */}
          </CardHeader>
          <CardContent>
            <MentorVerificationForm 
              onSubmit={(data) => {
                const storedData = localStorage.getItem('evolvix_registration');
                if (storedData) {
                  const parsedData = JSON.parse(storedData);
                  const verificationKey = `evolvix_mentor_verification_${parsedData.email}`;
                  localStorage.setItem(verificationKey, JSON.stringify({
                    ...data,
                    status: 'pending',
                    submittedAt: new Date().toISOString()
                  }));
                  alert('Verification submitted successfully! It will be reviewed by admin.');
                }
              }}
            />
          </CardContent>
        </Card>
      )}

      {section === 'account' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-green-600" />
              <span>Account & Security</span>
            </CardTitle>
            <CardDescription>Manage your login and security credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email/Phone */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={personalInfo.email}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full font-medium flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Re-verify
                  </Button>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full font-medium flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Re-verify
                  </Button>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-white mb-4">Change Password</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Current Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">New Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Confirm New Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg" />
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </div>

            {/* 2FA */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enable via OTP / Auth App</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={profile.twoFactorAuth} onChange={handleToggleTwoFactor} />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-600/30 dark:peer-focus:ring-green-600/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            {/* Linked Accounts */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-900 dark:text-white">Linked Accounts</span>
                <Button variant="outline" size="sm">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connect Account
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Google</span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">LinkedIn</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </div>

            {/* Delete Account */}
            <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-red-700 dark:text-red-400">Delete Account</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Permanently remove your account</p>
                </div>
                <Button variant="outline" size="sm" className="border-red-300 dark:border-red-700 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {section === 'payout' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span>Payout & Financials</span>
            </CardTitle>
            <CardDescription>Manage your payment and financial information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Account */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Bank Account</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Account Holder Name</label>
                  <input
                    type="text"
                    value={payoutInfo.accountHolderName}
                    onChange={(e) => setPayoutInfo({...payoutInfo, accountHolderName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Account Number</label>
                  <input
                    type="text"
                    value={payoutInfo.accountNumber}
                    onChange={(e) => setPayoutInfo({...payoutInfo, accountNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">IFSC Code</label>
                  <input
                    type="text"
                    value={payoutInfo.ifscCode}
                    onChange={(e) => setPayoutInfo({...payoutInfo, ifscCode: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Bank Name</label>
                  <input
                    type="text"
                    value={payoutInfo.bankName}
                    onChange={(e) => setPayoutInfo({...payoutInfo, bankName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">UPI ID</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={payoutInfo.upiId}
                  onChange={(e) => setPayoutInfo({...payoutInfo, upiId: e.target.value})}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <Button variant="outline">Add</Button>
                {payoutInfo.upiId && <Button variant="outline" onClick={() => setPayoutInfo({...payoutInfo, upiId: ''})}>Remove</Button>}
              </div>
            </div>

            {/* Payment Gateway */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Payment Gateway</h3>
              <div className="space-y-3">
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Stripe</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Connect for payouts</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Razorpay</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Connect for payouts</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Payout History</h3>
              <Button variant="outline">
                <Receipt className="w-4 h-4 mr-2" />
                View Payout History
              </Button>
            </div>

            {/* Tax Info */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tax Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">PAN</label>
                  <input
                    type="text"
                    value={payoutInfo.pan}
                    onChange={(e) => setPayoutInfo({...payoutInfo, pan: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">GST</label>
                  <input
                    type="text"
                    value={payoutInfo.gst}
                    onChange={(e) => setPayoutInfo({...payoutInfo, gst: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => alert('Payout settings saved!')} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {section === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-green-600" />
              <span>Notification Settings</span>
            </CardTitle>
            <CardDescription>Control what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Student Messages', desc: 'Notify on new message', key: 'studentMessages' as const },
              { name: 'Booking Alerts', desc: 'Notify when class booked', key: 'bookingAlerts' as const },
              { name: 'Payment Updates', desc: 'Payout confirmation', key: 'paymentUpdates' as const },
              { name: 'System Alerts', desc: 'Platform changes', key: 'systemAlerts' as const },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={(profile.notifications as any)[item.key] || false}
                    onChange={(e) => handleNotificationToggle(item.key as any, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-600/30 dark:peer-focus:ring-green-600/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {section === 'privacy' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Privacy & Security</span>
            </CardTitle>
            <CardDescription>Manage your privacy settings and data control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Visibility */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Profile Visibility</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Control who can see your profile</p>
                </div>
                <select 
                  value={profile.privacySettings.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {/* Reviews Visibility */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Reviews Visibility</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show or hide reviews</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={(profile.privacySettings as any).reviewsVisibility !== false}
                    onChange={(e) => handlePrivacyChange('reviewsVisibility' as any, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-600/30 dark:peer-focus:ring-green-600/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            {/* Data Download */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Data Download</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Export your data</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Generate File
                </Button>
              </div>
            </div>

            {/* Session History */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Session History</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active logins</p>
                </div>
                <Button variant="outline" size="sm">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View & Revoke Access
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {section === 'preferences' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-green-600" />
              <span>Preferences</span>
            </CardTitle>
            <CardDescription>Customize your app appearance and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div onClick={toggleTheme} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition p-2 rounded">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-green-600" /> : <Sun className="w-5 h-5 text-green-600" />}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Theme</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Currently using {theme} mode</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>

            {/* Default Dashboard Tab */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <label className="font-medium text-slate-900 dark:text-white mb-2 block flex items-center space-x-2">
                <Layout className="w-4 h-4" />
                <span>Default Dashboard Tab</span>
              </label>
              <select 
                value={(profile.preferences as any).defaultDashboardTab || 'classes'}
                onChange={(e) => handlePreferenceChange('defaultDashboardTab' as any, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="classes">Classes</option>
                <option value="messages">Messages</option>
                <option value="earnings">Earnings</option>
              </select>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Choose your default dashboard view</p>
            </div>

            {/* Language */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <label className="font-medium text-slate-900 dark:text-white mb-2 block flex items-center space-x-2">
                <Languages className="w-4 h-4" />
                <span>Language</span>
              </label>
              <select 
                value={profile.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Select your preferred language</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!section && (
        <Card>
          <CardHeader>
            <CardTitle>Mentor Settings</CardTitle>
            <CardDescription>Select a section from the sidebar to configure your settings.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
    );
  }

  // Fallback if role doesn't match
  return null;
}
