"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/forms/Card';
import { DollarSign, TrendingUp, Users, BookOpen, CreditCard } from 'lucide-react';
import { RevenueData } from './types';

interface RevenueAnalyticsProps {
  revenueData: RevenueData[];
}

export function RevenueAnalytics({ revenueData }: RevenueAnalyticsProps) {
  const totalEarnings = revenueData.reduce((sum, r) => sum + r.earnings, 0);
  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const earningsGrowth = previousMonth
    ? ((currentMonth.earnings - previousMonth.earnings) / previousMonth.earnings) * 100
    : 0;

  const maxEarnings = Math.max(...revenueData.map(r => r.earnings));
  const minEarnings = Math.min(...revenueData.map(r => r.earnings));

  // Calculate average monthly earnings
  const averageMonthlyEarnings = totalEarnings / revenueData.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${(totalEarnings / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {earningsGrowth >= 0 ? '+' : ''}{earningsGrowth.toFixed(1)}% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">This Month</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${(currentMonth.earnings / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {currentMonth.students} students
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Monthly</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${(averageMonthlyEarnings / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Over {revenueData.length} months
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {currentMonth.students}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {currentMonth.courses} active courses
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Earnings Chart */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Monthly Earnings Chart</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Chart Visualization */}
            <div className="relative h-64 flex items-end justify-between space-x-2">
              {revenueData.map((month, index) => {
                const height = ((month.earnings - minEarnings) / (maxEarnings - minEarnings)) * 100;
                const isCurrentMonth = index === revenueData.length - 1;
                
                return (
                  <div key={`${month.month}-${month.year}`} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex flex-col items-center">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap">
                          <div className="font-semibold">{month.month} {month.year}</div>
                          <div>${month.earnings.toLocaleString()}</div>
                          <div className="text-slate-400">{month.students} students</div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
                      </div>
                      
                      {/* Bar */}
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer ${
                          isCurrentMonth
                            ? 'bg-gradient-to-t from-green-600 to-green-400'
                            : 'bg-gradient-to-t from-blue-600 to-blue-400'
                        }`}
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                    </div>
                    
                    {/* Month Label */}
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 text-center">
                      {month.month}
                    </div>
                    
                    {/* Value Label */}
                    <div className={`mt-1 text-xs font-semibold ${
                      isCurrentMonth ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      ${(month.earnings / 1000).toFixed(0)}K
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Month
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Earnings
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Students
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Courses
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Transactions
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.slice().reverse().map((month, index, array) => {
                    const previousMonthData = array[index + 1];
                    const growth = previousMonthData
                      ? ((month.earnings - previousMonthData.earnings) / previousMonthData.earnings) * 100
                      : 0;
                    
                    return (
                      <tr
                        key={`${month.month}-${month.year}`}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {month.month} {month.year}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            ${month.earnings.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {month.students}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {month.courses}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {month.transactions}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {previousMonthData && (
                            <span className={`text-sm font-semibold ${
                              growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

