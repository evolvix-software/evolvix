"use client";

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
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
  X as XIcon
} from 'lucide-react';
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

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

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

  return (
    <StudentLayout title="My Profile">
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-[#635bff]" />
              <span>Profile Picture</span>
            </CardTitle>
            <CardDescription>Upload and manage your profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-[#635bff] to-[#4f48cc] rounded-full flex items-center justify-center text-white text-4xl font-bold">
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">John Doe</h3>
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
                <User className="w-5 h-5 text-[#635bff]" />
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Gender
                </label>
                <select
                  defaultValue={profile.personalInfo.gender || 'male'}
                  disabled={!profile.isEditing.personalInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                <GraduationCap className="w-5 h-5 text-[#635bff]" />
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Degree</label>
                <input
                  type="text"
                  defaultValue={profile.educationInfo.degree || 'Bachelor of Science'}
                  disabled={!profile.isEditing.educationInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Year</label>
                <input
                  type="text"
                  defaultValue={profile.educationInfo.year || '2024'}
                  disabled={!profile.isEditing.educationInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Specialization</label>
                <input
                  type="text"
                  defaultValue={profile.educationInfo.specialization || 'Computer Science'}
                  disabled={!profile.isEditing.educationInfo}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-800"
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
                <Star className="w-5 h-5 text-[#635bff]" />
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
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <Button onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>
            )}

            {/* Skills List */}
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <div key={skill.id} className="flex items-center space-x-2 px-3 py-1 bg-[#635bff]/10 dark:bg-[#635bff]/20 text-[#635bff] dark:text-[#735fff] rounded-full">
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
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
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
              <Shield className="w-5 h-5 text-[#635bff]" />
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
                    : 'bg-[#635bff]/10 dark:bg-[#635bff]/20'
                }`}>
                  <Shield className={`w-6 h-6 ${
                    profile.kycStatus.status === 'verified'
                      ? 'text-green-600 dark:text-green-400'
                      : profile.kycStatus.status === 'rejected'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-[#635bff] dark:text-[#735fff]'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white capitalize">
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
    </StudentLayout>
  );
}

