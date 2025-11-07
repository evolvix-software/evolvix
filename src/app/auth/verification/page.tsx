"use client";

import { useState } from "react";
import { createElement } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, AlertCircle, Upload, Camera, FileText } from "lucide-react";

type VerificationLevel = 0 | 1 | 2 | 3;

const verificationLevels = [
  {
    level: 0,
    title: "Basic Access",
    description: "Sign up and basic browsing",
    icon: Clock,
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    features: [
      "Browse public content",
      "Basic profile creation",
      "View general information"
    ],
    requirements: ["Email verification"]
  },
  {
    level: 1,
    title: "Identity Verified",
    description: "Enhanced access with verified identity",
    icon: CheckCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    features: [
      "Access to verified content",
      "Participate in discussions",
      "Apply for basic opportunities",
      "Connect with other users"
    ],
    requirements: [
      "ID document upload",
      "Profile picture",
      "Basic profile completion"
    ]
  },
  {
    level: 2,
    title: "Role Verified",
    description: "Full access based on your role",
    icon: Shield,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    features: [
      "Full portal access",
      "Role-specific features",
      "Advanced opportunities",
      "Priority support"
    ],
    requirements: [
      "Role-specific documents",
      "Professional verification",
      "Background check (if required)"
    ]
  },
  {
    level: 3,
    title: "Premium Verified",
    description: "Highest trust level for sensitive actions",
    icon: Shield,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    features: [
      "Financial transactions",
      "Sensitive data access",
      "Admin privileges",
      "Exclusive opportunities"
    ],
    requirements: [
      "Enhanced KYC",
      "Financial verification",
      "Reference checks",
      "Additional security measures"
    ]
  }
];

const roleSpecificRequirements = {
  student: [
    "Student ID or enrollment proof",
    "Educational institution verification",
    "Academic transcripts (optional)",
    "Portfolio or projects (optional)"
  ],
  mentor: [
    "Professional degree/certification",
    "Work experience proof",
    "LinkedIn profile verification",
    "Portfolio or achievements"
  ],
  employer: [
    "Company registration documents",
    "Business license",
    "Official company email verification",
    "Company website verification"
  ],
  investor: [
    "Financial documents",
    "Investment portfolio proof",
    "KYC compliance documents",
    "Professional references"
  ],
  sponsor: [
    "Organization registration",
    "CSR policy documents",
    "Financial capability proof",
    "Previous sponsorship history"
  ]
};

export default function VerificationPage() {
  const [currentLevel, setCurrentLevel] = useState<VerificationLevel>(0);
  const [userRole, setUserRole] = useState<keyof typeof roleSpecificRequirements>("student");

  const getCurrentLevelData = () => verificationLevels[currentLevel];
  const getNextLevelData = () => verificationLevels[currentLevel + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verification Center</h1>
          <p className="text-muted-foreground">
            Enhance your account security and unlock more features
          </p>
        </div>

        {/* Current Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Current Verification Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${getCurrentLevelData().bgColor}`}>
                  {createElement(getCurrentLevelData().icon, { className: `w-6 h-6 ${getCurrentLevelData().color}` })}
                </div>
                <div>
                  <h3 className="font-semibold">{getCurrentLevelData().title}</h3>
                  <p className="text-sm text-muted-foreground">{getCurrentLevelData().description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                Level {currentLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Level Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Current Access</span>
              </CardTitle>
              <CardDescription>
                Features available at your current verification level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getCurrentLevelData().features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Level Preview */}
          {currentLevel < 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Next Level Preview</span>
                </CardTitle>
                <CardDescription>
                  Unlock more features by upgrading to Level {currentLevel + 1}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">{getNextLevelData().title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {getNextLevelData().description}
                  </p>
                </div>
                <ul className="space-y-2">
                  {getNextLevelData().features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Verification Requirements */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Verification Requirements</CardTitle>
            <CardDescription>
              Complete these steps to upgrade your verification level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Requirements */}
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Basic Requirements (Level 1)</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {verificationLevels[1].requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role-Specific Requirements */}
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Role-Specific Requirements (Level 2)</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {roleSpecificRequirements[userRole].map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Camera className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          {currentLevel < 3 && (
            <Button size="lg" className="flex-1 sm:flex-none">
              Start Verification Process
            </Button>
          )}
          <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
            <Link href="/dashboard">Continue to Dashboard</Link>
          </Button>
        </div>

        {/* Important Notice */}
        <Card className="mt-6 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200">
                  Verification is Optional
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  You can use the platform without verification. Higher verification levels are only required 
                  when you want to access sensitive features, participate in financial transactions, or view 
                  restricted content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
