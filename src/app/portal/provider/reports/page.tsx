"use client";

import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <Layout title="Reports & Exports" role="provider" noCard>
      <div className="space-y-6">
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Info className="w-8 h-8 text-blue-600 dark:text-blue-400 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">
                  Reports & Exports (Admin Only)
                </h2>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  Comprehensive financial reports and analytics are managed exclusively by Evolvix administrators.
                </p>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  As a scholarship provider, you can view:
                </p>
                <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 mb-4 space-y-2">
                  <li>Your own fund transactions (transparency)</li>
                  <li>Evolvix fund distribution to scholars (transparency)</li>
                  <li>Growth of scholars you've donated to (if applicable)</li>
                </ul>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  To access these transparency features, please visit the <strong>Fund Management</strong> page.
                </p>
                <div className="flex gap-3 mt-6">
                  <Link href="/portal/provider/funds">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      Go to Fund Management
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
