"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { Course } from '@/data/mock/coursesData';
import { DollarSign, Users, Lock, Award, GraduationCap, UserPlus, Save, X, Plus, Trash2, Tag } from 'lucide-react';

interface CourseSettingsProps {
  course: Course;
  onUpdate: (updates: Partial<Course>) => void;
}

export function CourseSettings({ course, onUpdate }: CourseSettingsProps) {
  const [pricing, setPricing] = useState({
    price: course.price || 0,
    isFree: course.price === 0,
    discount: 0,
    couponCode: '',
  });

  const [enrollment, setEnrollment] = useState({
    maxStudents: course.maxStudents || 0,
    enrollmentLimit: course.maxStudents ? true : false,
  });

  const [accessControl, setAccessControl] = useState({
    visibility: course.visibility || 'public', // public, private, invite-only
  });

  const [certificates, setCertificates] = useState({
    autoGenerate: course.autoCertificate || false,
    certificateTemplate: course.certificateTemplate || '',
  });

  const [badges, setBadges] = useState<Array<{ id: string; name: string; description: string; criteria: string }>>(
    course.badges || []
  );

  const [prerequisites, setPrerequisites] = useState<Array<{ id: string; title: string }>>(
    course.prerequisites?.map(p => ({ id: p.id, title: p.title })) || []
  );

  const [coInstructors, setCoInstructors] = useState<Array<{ id: string; name: string; email: string }>>(
    course.coInstructors || []
  );

  const [teachingAssistants, setTeachingAssistants] = useState<Array<{ id: string; name: string; email: string }>>(
    course.teachingAssistants || []
  );

  const [newBadge, setNewBadge] = useState({ name: '', description: '', criteria: '' });
  const [newInstructor, setNewInstructor] = useState({ name: '', email: '' });
  const [newTA, setNewTA] = useState({ name: '', email: '' });

  const handleSave = () => {
    onUpdate({
      price: pricing.isFree ? 0 : pricing.price,
      maxStudents: enrollment.enrollmentLimit ? enrollment.maxStudents : undefined,
      visibility: accessControl.visibility as 'public' | 'private' | 'invite-only',
      autoCertificate: certificates.autoGenerate,
      certificateTemplate: certificates.certificateTemplate,
      badges,
      coInstructors,
      teachingAssistants,
    });
  };

  const addBadge = () => {
    if (newBadge.name && newBadge.description && newBadge.criteria) {
      setBadges([...badges, { id: `badge_${Date.now()}`, ...newBadge }]);
      setNewBadge({ name: '', description: '', criteria: '' });
    }
  };

  const removeBadge = (id: string) => {
    setBadges(badges.filter(b => b.id !== id));
  };

  const addCoInstructor = () => {
    if (newInstructor.name && newInstructor.email) {
      setCoInstructors([...coInstructors, { id: `instructor_${Date.now()}`, ...newInstructor }]);
      setNewInstructor({ name: '', email: '' });
    }
  };

  const removeCoInstructor = (id: string) => {
    setCoInstructors(coInstructors.filter(i => i.id !== id));
  };

  const addTA = () => {
    if (newTA.name && newTA.email) {
      setTeachingAssistants([...teachingAssistants, { id: `ta_${Date.now()}`, ...newTA }]);
      setNewTA({ name: '', email: '' });
    }
  };

  const removeTA = (id: string) => {
    setTeachingAssistants(teachingAssistants.filter(ta => ta.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Pricing Management */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span>Pricing Management</span>
          </CardTitle>
          <CardDescription>Set course pricing and discounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFree"
              checked={pricing.isFree}
              onChange={(e) => setPricing({ ...pricing, isFree: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="isFree">Free Course</Label>
          </div>
          {!pricing.isFree && (
            <>
              <div>
                <Label htmlFor="price">Course Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={pricing.price}
                  onChange={(e) => setPricing({ ...pricing, price: parseFloat(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={pricing.discount}
                  onChange={(e) => setPricing({ ...pricing, discount: parseFloat(e.target.value) || 0 })}
                  className="mt-1"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="couponCode">Coupon Code</Label>
                <Input
                  id="couponCode"
                  value={pricing.couponCode}
                  onChange={(e) => setPricing({ ...pricing, couponCode: e.target.value })}
                  className="mt-1"
                  placeholder="e.g., SUMMER2024"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Enrollment Limits */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Enrollment Limits</span>
          </CardTitle>
          <CardDescription>Control maximum number of students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enrollmentLimit"
              checked={enrollment.enrollmentLimit}
              onChange={(e) => setEnrollment({ ...enrollment, enrollmentLimit: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="enrollmentLimit">Enable Enrollment Limit</Label>
          </div>
          {enrollment.enrollmentLimit && (
            <div>
              <Label htmlFor="maxStudents">Maximum Students</Label>
              <Input
                id="maxStudents"
                type="number"
                value={enrollment.maxStudents}
                onChange={(e) => setEnrollment({ ...enrollment, maxStudents: parseInt(e.target.value) || 0 })}
                className="mt-1"
                min="1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Access Control</span>
          </CardTitle>
          <CardDescription>Set course visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="public"
                name="visibility"
                value="public"
                checked={accessControl.visibility === 'public'}
                onChange={(e) => setAccessControl({ ...accessControl, visibility: e.target.value as 'public' | 'private' | 'invite-only' })}
                className="w-4 h-4"
              />
              <Label htmlFor="public">Public - Anyone can enroll</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="private"
                name="visibility"
                value="private"
                checked={accessControl.visibility === 'private'}
                onChange={(e) => setAccessControl({ ...accessControl, visibility: e.target.value as 'public' | 'private' | 'invite-only' })}
                className="w-4 h-4"
              />
              <Label htmlFor="private">Private - Only invited students</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="invite-only"
                name="visibility"
                value="invite-only"
                checked={accessControl.visibility === 'invite-only'}
                onChange={(e) => setAccessControl({ ...accessControl, visibility: e.target.value as 'public' | 'private' | 'invite-only' })}
                className="w-4 h-4"
              />
              <Label htmlFor="invite-only">Invite-Only - Requires approval</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Generation */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span>Certificate Generation</span>
          </CardTitle>
          <CardDescription>Automatically generate certificates on completion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoCertificate"
              checked={certificates.autoGenerate}
              onChange={(e) => setCertificates({ ...certificates, autoGenerate: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="autoCertificate">Auto-generate certificates</Label>
          </div>
          {certificates.autoGenerate && (
            <div>
              <Label htmlFor="certificateTemplate">Certificate Template</Label>
              <textarea
                id="certificateTemplate"
                value={certificates.certificateTemplate}
                onChange={(e) => setCertificates({ ...certificates, certificateTemplate: e.target.value })}
                className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                rows={4}
                placeholder="Certificate design template..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badge System */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span>Badge System</span>
          </CardTitle>
          <CardDescription>Create achievement badges for students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {badges.map((badge) => (
              <div key={badge.id} className="p-3 border border-border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{badge.name}</p>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Criteria: {badge.criteria}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBadge(badge.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-3">
            <div>
              <Label htmlFor="badgeName">Badge Name</Label>
              <Input
                id="badgeName"
                value={newBadge.name}
                onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                className="mt-1"
                placeholder="e.g., Perfect Score"
              />
            </div>
            <div>
              <Label htmlFor="badgeDescription">Description</Label>
              <Input
                id="badgeDescription"
                value={newBadge.description}
                onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                className="mt-1"
                placeholder="Badge description"
              />
            </div>
            <div>
              <Label htmlFor="badgeCriteria">Criteria</Label>
              <Input
                id="badgeCriteria"
                value={newBadge.criteria}
                onChange={(e) => setNewBadge({ ...newBadge, criteria: e.target.value })}
                className="mt-1"
                placeholder="e.g., Score 100% on all quizzes"
              />
            </div>
            <Button onClick={addBadge} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Badge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Co-Instructors */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Co-Instructors</span>
          </CardTitle>
          <CardDescription>Add other mentors as instructors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {coInstructors.map((instructor) => (
              <div key={instructor.id} className="p-3 border border-border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{instructor.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCoInstructor(instructor.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-3">
            <div>
              <Label htmlFor="instructorName">Name</Label>
              <Input
                id="instructorName"
                value={newInstructor.name}
                onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                className="mt-1"
                placeholder="Instructor name"
              />
            </div>
            <div>
              <Label htmlFor="instructorEmail">Email</Label>
              <Input
                id="instructorEmail"
                type="email"
                value={newInstructor.email}
                onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                className="mt-1"
                placeholder="instructor@example.com"
              />
            </div>
            <Button onClick={addCoInstructor} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Co-Instructor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Assistants */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span>Teaching Assistants</span>
          </CardTitle>
          <CardDescription>Manage teaching assistants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {teachingAssistants.map((ta) => (
              <div key={ta.id} className="p-3 border border-border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{ta.name}</p>
                  <p className="text-sm text-muted-foreground">{ta.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTA(ta.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-3">
            <div>
              <Label htmlFor="taName">Name</Label>
              <Input
                id="taName"
                value={newTA.name}
                onChange={(e) => setNewTA({ ...newTA, name: e.target.value })}
                className="mt-1"
                placeholder="TA name"
              />
            </div>
            <div>
              <Label htmlFor="taEmail">Email</Label>
              <Input
                id="taEmail"
                type="email"
                value={newTA.email}
                onChange={(e) => setNewTA({ ...newTA, email: e.target.value })}
                className="mt-1"
                placeholder="ta@example.com"
              />
            </div>
            <Button onClick={addTA} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Teaching Assistant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}

