"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { DollarSign, TrendingUp, Clock, CreditCard, FileText, Download } from 'lucide-react';
import { RevenueData } from '@/interfaces/analytics';
import { LineChart } from '@/components/common/dashboard/common/LineChart';
import { Button } from '@/components/common/forms/Button';

interface FinancialAnalyticsProps {
  revenueData: RevenueData[];
}

export function FinancialAnalytics({ revenueData }: FinancialAnalyticsProps) {
  // Calculate totals
  const totalEarnings = revenueData.reduce((sum, r) => sum + r.earnings, 0);
  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const earningsGrowth = previousMonth
    ? ((currentMonth.earnings - previousMonth.earnings) / previousMonth.earnings) * 100
    : 0;

  // Mock data for additional metrics
  const weeklyEarnings = [
    { label: 'Week 1', value: 1200 },
    { label: 'Week 2', value: 1800 },
    { label: 'Week 3', value: 2100 },
    { label: 'Week 4', value: 2400 },
  ];

  const revenueByCourse = [
    { course: 'React Mastery', earnings: 4500, students: 25 },
    { course: 'Node.js Advanced', earnings: 3200, students: 18 },
    { course: 'Python Data Science', earnings: 2800, students: 15 },
  ];

  const paymentMethods = [
    { method: 'Credit Card', count: 45, amount: 8500 },
    { method: 'PayPal', count: 23, amount: 4200 },
    { method: 'Bank Transfer', count: 12, amount: 1800 },
  ];

  const pendingPayments = [
    { student: 'John Doe', course: 'React Mastery', amount: 199, dueDate: '2024-01-15' },
    { student: 'Jane Smith', course: 'Node.js Advanced', amount: 299, dueDate: '2024-01-20' },
  ];

  const commissionRate = 0.15; // 15% platform commission
  const mentorEarnings = totalEarnings * (1 - commissionRate);
  const platformCommission = totalEarnings * commissionRate;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  ${(totalEarnings / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {earningsGrowth >= 0 ? '+' : ''}{earningsGrowth.toFixed(1)}% vs last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">This Month</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  ${(currentMonth.earnings / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {currentMonth.students} students
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Mentor Earnings</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  ${(mentorEarnings / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  After {commissionRate * 100}% commission
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Pending Payments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  ${pendingPayments.reduce((sum, p) => sum + p.amount, 0)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {pendingPayments.length} transactions
                </p>
              </div>
              <Clock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Revenue Trends</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            title="Revenue Trend"
            data={revenueData.map(r => ({
              label: `${r.month} ${r.year}`,
              value: r.earnings,
            }))}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Revenue by Course */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Revenue by Course</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueByCourse.map((course, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-foreground">{course.course}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {course.students} students
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-foreground">
                    ${course.earnings.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    ${(course.earnings / course.students).toFixed(0)}/student
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method, idx) => {
                const percentage = (method.amount / totalEarnings) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">{method.method}</span>
                      <span className="font-semibold text-slate-900 dark:text-foreground">
                        ${method.amount.toLocaleString()} ({method.count})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-slate-600 dark:bg-slate-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Pending Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPayments.map((payment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-foreground">{payment.student}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {payment.course} • Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-foreground">
                    ${payment.amount}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Earnings Breakdown</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export for Tax
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                ${totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Platform Commission</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                ${platformCommission.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {commissionRate * 100}%
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Your Earnings</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                ${mentorEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {(1 - commissionRate) * 100}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

