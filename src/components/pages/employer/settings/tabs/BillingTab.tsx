"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { CreditCard, Download, Plus, Check } from 'lucide-react';
import { BillingPlan, PaymentMethod } from '../types';

interface BillingTabProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export function BillingTab({ onUnsavedChanges }: BillingTabProps) {
  const [currentPlan] = useState<BillingPlan>({
    id: '1',
    name: 'Professional',
    price: 99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited job postings',
      'Advanced analytics',
      'Team collaboration',
      'Priority support',
      'Custom branding',
    ],
    jobPostingCredits: 999,
    usage: {
      jobsPosted: 12,
      applicationsReceived: 245,
      teamMembers: 5,
    },
    limits: {
      maxJobs: 999,
      maxTeamMembers: 10,
      maxApplications: 9999,
    },
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
  ]);

  const [invoices] = useState([
    { id: '1', date: '2024-01-15', amount: 99, status: 'paid', downloadUrl: '#' },
    { id: '2', date: '2023-12-15', amount: 99, status: 'paid', downloadUrl: '#' },
    { id: '3', date: '2023-11-15', amount: 99, status: 'paid', downloadUrl: '#' },
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Billing & Subscription</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{currentPlan.name}</h3>
              <p className="text-3xl font-bold text-primary mt-2">
                ${currentPlan.price}
                <span className="text-lg text-muted-foreground">/{currentPlan.interval}</span>
              </p>
              {currentPlan.renewalDate && (
                <p className="text-sm text-muted-foreground mt-2">
                  Renews on {new Date(currentPlan.renewalDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Jobs Posted</p>
              <p className="text-2xl font-bold text-foreground">
                {currentPlan.usage.jobsPosted} / {currentPlan.limits.maxJobs}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Applications</p>
              <p className="text-2xl font-bold text-foreground">
                {currentPlan.usage.applicationsReceived} / {currentPlan.limits.maxApplications}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-2xl font-bold text-foreground">
                {currentPlan.usage.teamMembers} / {currentPlan.limits.maxTeamMembers}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h4 className="font-semibold text-foreground mb-3">Plan Features</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">
                    {method.brand} •••• {method.last4}
                  </div>
                  {method.expiryMonth && method.expiryYear && (
                    <div className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </div>
                  )}
                </div>
                {method.isDefault && (
                  <Badge variant="primary">Default</Badge>
                )}
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div>
                  <div className="font-medium text-foreground">
                    Invoice #{invoice.id} - {new Date(invoice.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${invoice.amount} • {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

