"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Calendar, Users } from 'lucide-react';
import { Event } from '@/store/features/student/studentSlice';

interface UpcomingEventsProps {
  events: Event[];
}

const iconMap = {
  Calendar,
  Users
};

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400'
  }
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span>Upcoming Events</span>
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Don't miss these learning opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming events</p>
          </div>
        ) : (
          events.map((event) => {
          const Icon = iconMap[event.icon as keyof typeof iconMap] || Calendar;
          const colors = colorMap[event.color as keyof typeof colorMap] || colorMap.blue;
          
          return (
            <div 
              key={event.id}
              className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {event.time}
                </p>
              </div>
              <button className="px-3 py-1 bg-[#635bff] hover:bg-[#4f48cc] text-white text-sm rounded-lg transition-colors">
                {event.action}
              </button>
            </div>
          );
        }))}
      </CardContent>
    </Card>
  );
}

