"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { useAppDispatch, useAppSelector, useTheme } from '@/hooks';
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
  setTwoFactorAuth,
  setProfilePicture
} from '@/store/features/profile/profileSlice';
import { MentorVerificationForm } from '@/components/common/verification';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  MapPin,
  Lock,
  CreditCard,
  Bell,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Link as LinkIcon,
  Trash2,

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
  Trophy,
  Download,
} from 'lucide-react';

interface SettingsContentProps {
  section?: string;
  role: 'student' | 'mentor' | 'employer';
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
    gpa: '',
    // School student fields (optional)
    isSchoolStudent: false,
    schoolName: '',
    gradeLevel: '', // 10th, 11th, 12th
    schoolBoard: '', // CBSE, ICSE, State Board, etc.
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
      gpa: '',
      isSchoolStudent: false,
      schoolName: '',
      gradeLevel: '',
      schoolBoard: '',
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
      <div className="space-y-8">
        {section === 'basic' && (
          <Card className="border-slate-200 dark:border-border bg-card dark:bg-card shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                  <User className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <span className="text-slate-900 dark:text-foreground">Personal Information</span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                Manage your personal details and identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-card"></div>
                  <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide px-3">Basic Information</h3>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-card"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <span>First Name</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <span>Last Name</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date of Birth</span>
                    </label>
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 dark:[&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <span>Gender</span>
                    </label>
                    <select 
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat dark:[filter:invert(1)]"
                    >
                      <option value="" className="bg-card dark:bg-card">Select Gender</option>
                      <option value="Male" className="bg-card dark:bg-card">Male</option>
                      <option value="Female" className="bg-card dark:bg-card">Female</option>
                      <option value="Other" className="bg-card dark:bg-card">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Country</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.country}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-card"></div>
                  <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide px-3">Contact Information</h3>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-card"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                        placeholder="your.email@example.com"
                      />
                      <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-lg font-medium flex items-center space-x-1.5 border border-green-200 dark:border-green-800 whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        readOnly
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground cursor-not-allowed opacity-75"
                        placeholder="+1 (555) 000-0000"
                      />
                      <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-lg font-medium flex items-center space-x-1.5 border border-green-200 dark:border-green-800 whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-card"></div>
                  <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide px-3">About Me</h3>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-card"></div>
                </div>
                <textarea
                  value={personalInfo.bio}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all resize-none"
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {personalInfo.bio.length} characters
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-secondary"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSavePersonalInfo} 
                  className="bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'education' && (
          <Card className="border-slate-200 dark:border-border bg-card dark:bg-card shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                  <GraduationCap className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <span className="text-slate-900 dark:text-foreground">Education & School Details</span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                Manage your educational qualifications and school information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* School Student Section (Optional) */}
              <div className="p-6 border border-slate-200 dark:border-border rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-[#2B2B32] dark:to-[#2B2B32]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground">School Student Information</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Optional: For students from 10th grade onwards</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={educationInfo.isSchoolStudent}
                      onChange={(e) => setEducationInfo({ ...educationInfo, isSchoolStudent: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#635bff]/20 dark:peer-focus:ring-[#635bff]/40 rounded-full peer dark:bg-card peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                {educationInfo.isSchoolStudent && (
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">School Name</label>
                      <input
                        type="text"
                        value={educationInfo.schoolName}
                        onChange={(e) => setEducationInfo({ ...educationInfo, schoolName: e.target.value })}
                        placeholder="Enter school name"
                        className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Grade Level</label>
                      <select
                        value={educationInfo.gradeLevel}
                        onChange={(e) => setEducationInfo({ ...educationInfo, gradeLevel: e.target.value })}
                        className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat dark:[filter:invert(1)]"
                      >
                        <option value="" className="bg-card dark:bg-card py-2">Select Grade</option>
                        <option value="10th" className="bg-card dark:bg-card py-2">10th Grade</option>
                        <option value="11th" className="bg-card dark:bg-card py-2">11th Grade</option>
                        <option value="12th" className="bg-card dark:bg-card py-2">12th Grade</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">School Board</label>
                      <select
                        value={educationInfo.schoolBoard}
                        onChange={(e) => setEducationInfo({ ...educationInfo, schoolBoard: e.target.value })}
                        className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat dark:[filter:invert(1)]"
                      >
                        <option value="" className="bg-card dark:bg-card py-2">Select Board</option>
                        <option value="CBSE" className="bg-card dark:bg-card py-2">CBSE</option>
                        <option value="ICSE" className="bg-card dark:bg-card py-2">ICSE</option>
                        <option value="State Board" className="bg-card dark:bg-card py-2">State Board</option>
                        <option value="IB" className="bg-card dark:bg-card py-2">International Baccalaureate (IB)</option>
                        <option value="IGCSE" className="bg-card dark:bg-card py-2">IGCSE</option>
                        <option value="Other" className="bg-card dark:bg-card py-2">Other</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* College/University Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-card"></div>
                  <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide px-3">College / University Information</h3>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-card"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">College/University</label>
                    <input
                      type="text"
                      value={educationInfo.college}
                      onChange={(e) => setEducationInfo({ ...educationInfo, college: e.target.value })}
                      placeholder="Enter college or university name"
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Degree / Qualification</label>
                    <input
                      type="text"
                      value={educationInfo.degree}
                      onChange={(e) => setEducationInfo({ ...educationInfo, degree: e.target.value })}
                      placeholder="e.g., B.Tech, B.Sc, B.A."
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Year of Graduation</label>
                    <input
                      type="text"
                      value={educationInfo.year}
                      onChange={(e) => setEducationInfo({ ...educationInfo, year: e.target.value })}
                      placeholder="e.g., 2024"
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Specialization / Major</label>
                    <input
                      type="text"
                      value={educationInfo.specialization}
                      onChange={(e) => setEducationInfo({ ...educationInfo, specialization: e.target.value })}
                      placeholder="e.g., Computer Science"
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">GPA / Grades (Optional)</label>
                    <input
                      type="text"
                      value={educationInfo.gpa}
                      onChange={(e) => setEducationInfo({ ...educationInfo, gpa: e.target.value })}
                      placeholder="e.g., 8.5/10 or 3.8/4.0"
                      className="w-full px-4 py-2.5 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-secondary"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEducation} 
                  className="bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'skills' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Skills & Interests</span>
              </CardTitle>
              <CardDescription>Add or remove your skills and interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Skills Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map((skill) => (
                    <span key={skill.id} className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-full text-sm flex items-center space-x-2">
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
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                  <Button onClick={handleAddSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Interests Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-3">Interests</h3>
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
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                  <Button onClick={handleAddInterest}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'kyc' && role === 'student' && (
          <Card className="border-slate-200 dark:border-border bg-card dark:bg-card shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className={`p-2 rounded-lg ${
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
                <span className="text-slate-900 dark:text-foreground">KYC & ID Verification</span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                Complete your identity verification to access all features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Card */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-[#2B2B32] dark:to-[#2B2B32] rounded-xl border border-slate-200 dark:border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Status Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-lg font-semibold capitalize ${
                        profile.kycStatus.status === 'verified'
                          ? 'text-green-700 dark:text-green-400'
                          : profile.kycStatus.status === 'rejected'
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-slate-900 dark:text-foreground'
                      }`}>
                        {profile.kycStatus.status === 'verified' ? 'Verified' : profile.kycStatus.status === 'rejected' ? 'Rejected' : 'Pending'} Verification
                      </h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        profile.kycStatus.status === 'verified'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                          : profile.kycStatus.status === 'rejected'
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                          : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary border border-[#635bff]/20 dark:border-[#735fff]/30'
                      }`}>
                        {profile.kycStatus.status === 'verified' ? 'Active' : profile.kycStatus.status === 'rejected' ? 'Action Required' : 'In Progress'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {profile.kycStatus.status === 'verified' 
                        ? 'Your identity has been verified and you have full access to all features.'
                        : profile.kycStatus.status === 'rejected'
                        ? 'Please review the requirements and resubmit your documents for verification.'
                        : profile.kycStatus.idUploaded 
                        ? 'Your ID documents have been uploaded and are currently under review.'
                        : 'Upload your ID documents to start the verification process.'}
                    </p>
                    {profile.kycStatus.verificationDate && (
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Verified on {new Date(profile.kycStatus.verificationDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={() => router.push('/portal/verification')}
                  className={`${
                    profile.kycStatus.status === 'verified' 
                      ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' 
                      : 'bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary'
                  } text-white shadow-sm hover:shadow-md transition-all`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {profile.kycStatus.status === 'verified' ? 'View Status' : profile.kycStatus.status === 'rejected' ? 'Resubmit Documents' : 'Start Verification'}
                </Button>
              </div>

              {/* Benefits Section */}
              {profile.kycStatus.status !== 'verified' && (
                <div className="p-5 border border-yellow-200 dark:border-yellow-800/50 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-3">Verification Benefits</h5>
                      <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Access to all courses and premium features</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Apply for scholarships and financial aid</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Participate in hackathons and competitions</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Get verified badge on your profile</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {section === 'achievements' && role === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Achievements & Certificates</span>
              </CardTitle>
              <CardDescription>View your earned certificates, badges, and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Certificates Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Certificates</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { id: '1', title: 'React Development Course', date: '2024-01-15', course: 'React Development' },
                    { id: '2', title: 'JavaScript Fundamentals', date: '2023-12-20', course: 'JavaScript Basics' },
                  ].map((cert) => (
                    <div key={cert.id} className="p-4 border border-slate-200 dark:border-border rounded-lg hover:bg-slate-50 dark:hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-foreground">{cert.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{cert.course}</p>
                        </div>
                        <Award className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Earned on {new Date(cert.date).toLocaleDateString()}</p>
                      <Button variant="outline" size="sm" className="mt-3 w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  ))}
                </div>
                {[].length === 0 && (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">No certificates earned yet. Complete courses to earn certificates!</p>
                )}
              </div>

              {/* Badges Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Badges</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: '1', name: 'First Code Commit', icon: '💻', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
                    { id: '2', name: 'Course Completer', icon: '🎓', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' },
                    { id: '3', name: 'Perfect Score', icon: '⭐', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' },
                  ].map((badge) => (
                    <div key={badge.id} className={`p-4 border border-slate-200 dark:border-border rounded-lg ${badge.color} flex flex-col items-center justify-center min-w-[120px]`}>
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <p className="text-sm font-medium text-center">{badge.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hackathon Wins */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Hackathon Achievements</h3>
                <div className="space-y-3">
                  {[
                    { id: '1', name: 'Tech Innovation Hackathon 2024', position: '1st Place', date: '2024-02-10' },
                  ].map((hackathon) => (
                    <div key={hackathon.id} className="p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-foreground">{hackathon.name}</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">{hackathon.position}</p>
                        </div>
                        <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Won on {new Date(hackathon.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'password' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-primary" />
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                />
              </div>
              <Button className="bg-primary hover:bg-[#4f48cc]">
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
                <CreditCard className="w-5 h-5 text-primary" />
                <span>Payment Methods</span>
              </CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Saved Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Saved Payment Methods</h3>
                
                {profile.paymentMethods.map((method) => (
                  <div key={method.id} className="p-4 border border-slate-200 dark:border-border rounded-lg mb-3">
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
                          <p className="font-medium text-slate-900 dark:text-foreground flex items-center">
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
                <div className="border-t border-slate-200 dark:border-border pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Add New Payment Method</h3>
                
                  <div className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full pl-12 pr-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
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
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                        />
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                      />
                    </div>

                    {/* Billing Address */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Billing Address</label>
                      <input
                        type="text"
                        placeholder="Street address"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground mb-2"
                      />
                      <div className="grid md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          className="px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          className="px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
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
                      <Button onClick={handleAddPaymentMethod} className="bg-primary hover:bg-[#4f48cc]">
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
                <Bell className="w-5 h-5 text-primary" />
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
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-border rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-foreground">{item.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={profile.notifications[item.key]}
                      onChange={(e) => handleNotificationToggle(item.key, e.target.checked)}
                    />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#635bff]/30 dark:peer-focus:ring-[#635bff]/40 rounded-full peer dark:bg-card peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
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
                <Palette className="w-5 h-5 text-primary" />
                <span>Preferences</span>
              </CardTitle>
              <CardDescription>Customize your app appearance and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Selection */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <div onClick={toggleTheme} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-secondary transition p-2 rounded">
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-foreground">Theme</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Currently using {theme} mode</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </Button>
                </div>
              </div>

              {/* Dashboard Layout */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <label className="font-medium text-slate-900 dark:text-foreground mb-2 block">Dashboard Layout</label>
                <select 
                  value={profile.preferences.dashboardLayout}
                  onChange={(e) => handlePreferenceChange('dashboardLayout', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                >
                  <option value="minimal">Minimal</option>
                  <option value="detailed">Detailed</option>
                  <option value="compact">Compact</option>
                </select>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Choose your preferred dashboard view</p>
              </div>

              {/* Language Selection */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <label className="font-medium text-slate-900 dark:text-foreground mb-2 block flex items-center space-x-2">
                  <Languages className="w-4 h-4" />
                  <span>Language</span>
                </label>
                <select 
                  value={profile.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Select your preferred language</p>
              </div>

              {/* Default Home Page */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <label className="font-medium text-slate-900 dark:text-foreground mb-2 block flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Default Home Page</span>
                </label>
                <select 
                  value={profile.preferences.defaultHomePage}
                  onChange={(e) => handlePreferenceChange('defaultHomePage', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
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
                <Shield className="w-5 h-5 text-primary" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>Manage your privacy settings and data control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Visibility */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-foreground">Profile Visibility</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Control who can see your profile</p>
                  </div>
                  <select 
                    value={profile.privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="px-3 py-1 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground text-sm"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-foreground">Data Sharing</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Allow analytics and data sharing</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={profile.privacySettings.dataSharing}
                      onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                    />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#635bff]/30 dark:peer-focus:ring-[#635bff]/40 rounded-full peer dark:bg-card peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* Session History */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-foreground">Active Sessions</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">View and manage your active logins</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Sessions
                  </Button>
                </div>
              </div>

              {/* Download Data */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-foreground">Download My Data</span>
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
                <Lock className="w-5 h-5 text-primary" />
                <span>Account & Security</span>
              </CardTitle>
              <CardDescription>Manage your login and security credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Two-Factor Authentication */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-foreground">Two-Factor Authentication</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={profile.twoFactorAuth}
                      onChange={handleToggleTwoFactor}
                    />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#635bff]/30 dark:peer-focus:ring-[#635bff]/40 rounded-full peer dark:bg-card peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* Linked Accounts */}
              <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-slate-900 dark:text-foreground">Linked Accounts</span>
                  <Button variant="outline" size="sm">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Connect Account
                  </Button>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Google</span>
                    <span className="text-slate-600 dark:text-slate-400">Connected</span>
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
              <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
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
                    ? 'bg-slate-50 dark:bg-card/20 border-slate-200 dark:border-border'
                    : verificationStatus === 'pending'
                    ? 'bg-slate-50 dark:bg-card/20 border-slate-200 dark:border-border'
                    : verificationStatus === 'rejected'
                    ? 'bg-slate-50 dark:bg-card/20 border-slate-200 dark:border-border'
                    : 'bg-slate-50 dark:bg-card/20 border-slate-200 dark:border-border'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {verificationStatus === 'approved' ? (
                            <CheckCircle2 className="w-12 h-12 text-slate-600 dark:text-slate-400" />
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
                              ? 'text-slate-900 dark:text-foreground'
                              : verificationStatus === 'pending'
                              ? 'text-slate-900 dark:text-foreground'
                              : verificationStatus === 'rejected'
                              ? 'text-slate-900 dark:text-foreground'
                              : 'text-slate-900 dark:text-foreground'
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
                              ? 'text-slate-600 dark:text-slate-400'
                              : verificationStatus === 'pending'
                              ? 'text-slate-600 dark:text-slate-400'
                              : verificationStatus === 'rejected'
                              ? 'text-slate-600 dark:text-slate-400'
                              : 'text-slate-600 dark:text-slate-400'
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
                        className={verificationStatus !== 'approved' ? 'bg-slate-700 dark:bg-secondary hover:bg-slate-800 dark:hover:bg-secondary text-white border-0' : ''}
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Gender</label>
                  <select 
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Country</label>
                  <input
                    type="text"
                    value={personalInfo.country}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Professional Summary</h3>
              <textarea
                value={professionalInfo.bio}
                onChange={(e) => setProfessionalInfo({ ...professionalInfo, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                placeholder="Write a short bio about your expertise and experience..."
              />
            </div>

            {/* Expertise/Skills */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Expertise / Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {professionalInfo.expertise.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-card text-slate-700 dark:text-slate-300 rounded-full text-sm flex items-center space-x-2">
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
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Experience</h3>
              {professionalInfo.experience.map((exp, idx) => (
                <div key={idx} className="p-4 border border-slate-200 dark:border-border rounded-lg mb-3">
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
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground" 
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
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground" 
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
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground" 
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

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Social Links</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5 text-gray-900 dark:text-foreground" />
                  <input
                    type="text"
                    placeholder="GitHub URL"
                    value={socialLinks.github}
                    onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <input
                    type="text"
                    placeholder="Portfolio URL"
                    value={socialLinks.portfolio}
                    onChange={(e) => setSocialLinks({...socialLinks, portfolio: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-border">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => alert('Profile settings saved!')} className="bg-slate-700 dark:bg-secondary hover:bg-slate-800 dark:hover:bg-secondary text-white border-0">
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
              <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
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
              <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span>Account & Security</span>
            </CardTitle>
            <CardDescription>Manage your login and security credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email/Phone */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
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
                      readOnly
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground cursor-not-allowed opacity-75"
                    />
                    <span className="px-3 py-1 bg-slate-100 dark:bg-card text-slate-700 dark:text-slate-300 text-xs rounded-full font-medium flex items-center space-x-1">
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
                      readOnly
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground cursor-not-allowed opacity-75"
                    />
                    <span className="px-3 py-1 bg-slate-100 dark:bg-card text-slate-700 dark:text-slate-300 text-xs rounded-full font-medium flex items-center space-x-1">
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
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-foreground mb-4">Change Password</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Current Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">New Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Confirm New Password</label>
                  <input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg" />
                </div>
                <Button className="bg-slate-700 dark:bg-secondary hover:bg-slate-800 dark:hover:bg-secondary text-white border-0">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </div>

            {/* 2FA */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-900 dark:text-foreground">Two-Factor Authentication</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enable via OTP / Auth App</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={profile.twoFactorAuth} onChange={handleToggleTwoFactor} />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-500/30 dark:peer-focus:ring-slate-400/40 rounded-full peer dark:bg-card peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-600 dark:peer-checked:bg-slate-500"></div>
                </label>
              </div>
            </div>

            {/* Linked Accounts */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-900 dark:text-foreground">Linked Accounts</span>
                <Button variant="outline" size="sm">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connect Account
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Google</span>
                  <span className="text-slate-600 dark:text-slate-400">Connected</span>
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
              <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span>Payout & Financials</span>
            </CardTitle>
            <CardDescription>Manage your payment and financial information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Account */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Bank Account</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Account Holder Name</label>
                  <input
                    type="text"
                    value={payoutInfo.accountHolderName}
                    onChange={(e) => setPayoutInfo({...payoutInfo, accountHolderName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Account Number</label>
                  <input
                    type="text"
                    value={payoutInfo.accountNumber}
                    onChange={(e) => setPayoutInfo({...payoutInfo, accountNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">IFSC Code</label>
                  <input
                    type="text"
                    value={payoutInfo.ifscCode}
                    onChange={(e) => setPayoutInfo({...payoutInfo, ifscCode: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Bank Name</label>
                  <input
                    type="text"
                    value={payoutInfo.bankName}
                    onChange={(e) => setPayoutInfo({...payoutInfo, bankName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">UPI ID</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={payoutInfo.upiId}
                  onChange={(e) => setPayoutInfo({...payoutInfo, upiId: e.target.value})}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                />
                <Button variant="outline">Add</Button>
                {payoutInfo.upiId && <Button variant="outline" onClick={() => setPayoutInfo({...payoutInfo, upiId: ''})}>Remove</Button>}
              </div>
            </div>

            {/* Payment Gateway */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Payment Gateway</h3>
              <div className="space-y-3">
                <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-900 dark:text-foreground">Stripe</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Connect for payouts</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
                <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-900 dark:text-foreground">Razorpay</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Connect for payouts</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Payout History</h3>
              <Button variant="outline">
                <Receipt className="w-4 h-4 mr-2" />
                View Payout History
              </Button>
            </div>

            {/* Tax Info */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-4">Tax Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">PAN</label>
                  <input
                    type="text"
                    value={payoutInfo.pan}
                    onChange={(e) => setPayoutInfo({...payoutInfo, pan: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">GST</label>
                  <input
                    type="text"
                    value={payoutInfo.gst}
                    onChange={(e) => setPayoutInfo({...payoutInfo, gst: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-border">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => alert('Payout settings saved!')} className="bg-slate-700 dark:bg-secondary hover:bg-slate-800 dark:hover:bg-secondary text-white border-0">
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
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
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
              <div key={item.key} className="flex items-center justify-between p-3 border border-slate-200 dark:border-border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-foreground">{item.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={(profile.notifications as any)[item.key] || false}
                    onChange={(e) => handleNotificationToggle(item.key as any, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-500/30 dark:peer-focus:ring-slate-400/40 rounded-full peer dark:bg-card peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-600 dark:peer-checked:bg-slate-500"></div>
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
              <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span>Privacy & Security</span>
            </CardTitle>
            <CardDescription>Manage your privacy settings and data control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Visibility */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-slate-900 dark:text-foreground">Profile Visibility</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Control who can see your profile</p>
                </div>
                <select 
                  value={profile.privacySettings.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="px-3 py-1 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground text-sm"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {/* Reviews Visibility */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-slate-900 dark:text-foreground">Reviews Visibility</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show or hide reviews</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={(profile.privacySettings as any).reviewsVisibility !== false}
                    onChange={(e) => handlePrivacyChange('reviewsVisibility' as any, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-500/30 dark:peer-focus:ring-slate-400/40 rounded-full peer dark:bg-card peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-600 dark:peer-checked:bg-slate-500"></div>
                </label>
              </div>
            </div>

            {/* Data Download */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-medium text-slate-900 dark:text-foreground">Data Download</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Export your data</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Generate File
                </Button>
              </div>
            </div>

            {/* Session History */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-medium text-slate-900 dark:text-foreground">Session History</span>
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
              <Palette className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span>Preferences</span>
            </CardTitle>
            <CardDescription>Customize your app appearance and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <div onClick={toggleTheme} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-secondary transition p-2 rounded">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-foreground">Theme</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Currently using {theme} mode</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>

            {/* Default Dashboard Tab */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <label className="font-medium text-slate-900 dark:text-foreground mb-2 block flex items-center space-x-2">
                <Layout className="w-4 h-4" />
                <span>Default Dashboard Tab</span>
              </label>
              <select 
                value={(profile.preferences as any).defaultDashboardTab || 'classes'}
                onChange={(e) => handlePreferenceChange('defaultDashboardTab' as any, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
              >
                <option value="classes">Classes</option>
                <option value="messages">Messages</option>
                <option value="earnings">Earnings</option>
              </select>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Choose your default dashboard view</p>
            </div>

            {/* Language */}
            <div className="p-4 border border-slate-200 dark:border-border rounded-lg">
              <label className="font-medium text-slate-900 dark:text-foreground mb-2 block flex items-center space-x-2">
                <Languages className="w-4 h-4" />
                <span>Language</span>
              </label>
              <select 
                value={profile.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground"
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

  // EMPLOYER SECTIONS
  if (role === 'employer') {
    const [companyInfo, setCompanyInfo] = useState({
      companyName: '',
      companySlug: '',
      industry: '',
      companySize: '',
      headquarters: '',
      website: '',
      description: '',
      linkedinUrl: '',
      twitterUrl: '',
      facebookUrl: '',
    });

    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [jobSettings, setJobSettings] = useState({
      defaultEmploymentType: 'full-time',
      defaultLocation: '',
      defaultRemoteType: 'remote',
      autoPublish: false,
      requireApproval: false,
      requireCoverLetter: false,
      requirePortfolio: false,
    });

    return (
      <div className="space-y-6">
        {section === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Company Profile</span>
              </CardTitle>
              <CardDescription>Manage your company information and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Company Name *
                  </label>
                  <Input
                    value={companyInfo.companyName}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Company Slug
                  </label>
                  <Input
                    value={companyInfo.companySlug}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, companySlug: e.target.value })}
                    placeholder="company-slug"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Industry *
                  </label>
                  <select
                    value={companyInfo.industry}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Company Size
                  </label>
                  <select
                    value={companyInfo.companySize}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, companySize: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Headquarters
                  </label>
                  <Input
                    value={companyInfo.headquarters}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, headquarters: e.target.value })}
                    placeholder="City, State, Country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Website
                  </label>
                  <Input
                    value={companyInfo.website}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Company Description
                </label>
                <textarea
                  value={companyInfo.description}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground min-h-[100px]"
                  placeholder="Tell us about your company..."
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Social Media Links</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      LinkedIn URL
                    </label>
                    <Input
                      value={companyInfo.linkedinUrl}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Twitter URL
                    </label>
                    <Input
                      value={companyInfo.twitterUrl}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, twitterUrl: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Facebook URL
                    </label>
                    <Input
                      value={companyInfo.facebookUrl}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-primary to-purple-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'team' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Team Management</span>
              </CardTitle>
              <CardDescription>Manage your team members and their permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-primary to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>
              {teamMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No team members yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Invite team members to collaborate on hiring
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <Badge variant="outline" className="mt-1">{member.role}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {section === 'jobs' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Job Posting Settings</span>
              </CardTitle>
              <CardDescription>Configure default settings for job postings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Default Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Default Employment Type
                    </label>
                    <select
                      value={jobSettings.defaultEmploymentType}
                      onChange={(e) => setJobSettings({ ...jobSettings, defaultEmploymentType: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Default Location
                    </label>
                    <Input
                      value={jobSettings.defaultLocation}
                      onChange={(e) => setJobSettings({ ...jobSettings, defaultLocation: e.target.value })}
                      placeholder="e.g., Remote, San Francisco, CA"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Application Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobSettings.requireCoverLetter}
                      onChange={(e) => setJobSettings({ ...jobSettings, requireCoverLetter: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">Require Cover Letter by default</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobSettings.requirePortfolio}
                      onChange={(e) => setJobSettings({ ...jobSettings, requirePortfolio: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">Require Portfolio by default</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobSettings.autoPublish}
                      onChange={(e) => setJobSettings({ ...jobSettings, autoPublish: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">Auto-publish new jobs</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-primary to-purple-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Control what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'New Applications', desc: 'Notify when new applications are received', key: 'newApplications' },
                { name: 'Application Status Changes', desc: 'Notify when application status changes', key: 'statusChanges' },
                { name: 'Job Expiring Soon', desc: 'Notify when jobs are about to expire', key: 'jobExpiring' },
                { name: 'New Messages', desc: 'Notify when you receive new messages', key: 'newMessages' },
                { name: 'Team Activity', desc: 'Notify about team member activities', key: 'teamActivity' },
                { name: 'System Updates', desc: 'Notify about platform updates', key: 'systemUpdates' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {section === 'integrations' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LinkIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Integrations</span>
              </CardTitle>
              <CardDescription>Connect with external tools and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'ATS Systems', desc: 'Greenhouse, Lever, Workday', status: 'disconnected' },
                { name: 'Calendar', desc: 'Google Calendar, Outlook', status: 'disconnected' },
                { name: 'Email', desc: 'Gmail, Outlook', status: 'disconnected' },
                { name: 'Slack', desc: 'Team communication', status: 'disconnected' },
                { name: 'Zapier', desc: 'Automation platform', status: 'disconnected' },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.desc}</p>
                  </div>
                  <Button variant={integration.status === 'connected' ? 'outline' : 'default'}>
                    {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {section === 'billing' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Billing & Subscription</span>
              </CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">Current Plan</p>
                    <p className="text-sm text-muted-foreground">Professional Plan</p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job Postings</span>
                    <span className="text-foreground">10 / Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Jobs</span>
                    <span className="text-foreground">8 / Unlimited</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">No payment method on file</p>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Billing History</h3>
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No billing history</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {section === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Change Password</Button>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                  </div>
                  <Button variant="outline" size="sm">View Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!section && (
          <Card>
            <CardHeader>
              <CardTitle>Employer Settings</CardTitle>
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
