"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/forms/Card';
import { Star, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { MentorAnalytics } from './types';

interface RatingsReviewsProps {
  analytics: MentorAnalytics;
}

export function RatingsReviews({ analytics }: RatingsReviewsProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRatingPercentage = (count: number) => {
    return (count / analytics.totalRatings) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Average Rating</p>
                <p className={`text-2xl font-bold ${getRatingColor(analytics.overallRating)}`}>
                  {analytics.overallRating.toFixed(1)}/5.0
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.round(analytics.overallRating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Ratings</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.totalRatings}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  From students
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Reviews</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.totalReviews}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Written feedback
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">5-Star Ratings</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {analytics.ratingDistribution.five}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {getRatingPercentage(analytics.ratingDistribution.five).toFixed(0)}% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400 fill-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Rating Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stars: 5, count: analytics.ratingDistribution.five, label: 'Excellent' },
              { stars: 4, count: analytics.ratingDistribution.four, label: 'Very Good' },
              { stars: 3, count: analytics.ratingDistribution.three, label: 'Good' },
              { stars: 2, count: analytics.ratingDistribution.two, label: 'Fair' },
              { stars: 1, count: analytics.ratingDistribution.one, label: 'Poor' }
            ].map(({ stars, count, label }) => {
              const percentage = getRatingPercentage(count);
              return (
                <div key={stars} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= stars
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            stars >= 4 ? 'bg-green-500' :
                            stars >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white w-16 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Recent Reviews</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {review.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {review.studentName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {review.courseTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                  {review.review}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.helpful} helpful</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

