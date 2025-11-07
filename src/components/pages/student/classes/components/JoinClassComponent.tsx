"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/common/forms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Clock, Users, Video, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { MentorClass } from '@/store/features/classes/classesSlice';

interface JoinClassComponentProps {
  classItem: MentorClass;
  studentName: string;
  studentEmail: string;
  onClose: () => void;
}

export function JoinClassComponent({
  classItem,
  studentName,
  studentEmail,
  onClose,
}: JoinClassComponentProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [canJoin, setCanJoin] = useState(false);
  const [timeUntil, setTimeUntil] = useState<{ hours: number; minutes: number } | null>(null);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiAPIRef = useRef<any>(null);

  // Calculate if class time has arrived
  useEffect(() => {
    const checkClassTime = () => {
      if (!classItem.date || !classItem.time) {
        setCanJoin(true);
        return;
      }

      const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
      const now = new Date();
      
      // Allow joining 5 minutes before class time
      const joinTime = new Date(classDateTime.getTime() - 5 * 60 * 1000);
      
      if (now >= joinTime) {
        setCanJoin(true);
      } else {
        setCanJoin(false);
        const diff = joinTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntil({ hours, minutes });
        
        // Set timeout to enable join button
        setTimeout(() => {
          setCanJoin(true);
          setTimeUntil(null);
        }, diff);
      }
    };

    checkClassTime();
    const interval = setInterval(checkClassTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [classItem.date, classItem.time]);

  // Initialize Jitsi Meet for students
  useEffect(() => {
    if (isJoined && jitsiContainerRef.current && classItem.meetingId) {
      const script = document.createElement('script');
      script.src = 'https://8x8.vc/external_api.js';
      script.async = true;
      
      script.onload = () => {
        // @ts-ignore
        if (window.JitsiMeetExternalAPI) {
          const domain = 'meet.jit.si';
          const options = {
            roomName: classItem.meetingId,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            configOverwrite: {
              prejoinPageEnabled: true, // Students see prejoin page
              startWithAudioMuted: true, // Start muted
              startWithVideoMuted: true, // Start with video off
              enableWelcomePage: false,
              // Enable waiting room (knocking)
              enableKnockingLobby: true,
              // Enable screenshare
              enableLayerSuspension: true,
              // Enable all video features
              enableNoAudioDetection: true,
              enableNoisyMicDetection: true,
              enableTalkWhileMuted: true,
              // Recording and streaming
              enableRecording: false, // Students can't record
              enableLiveStreaming: false,
              // Chat and other features
              enableChat: true,
              enableClosePage: true,
              // Security
              requireDisplayName: true,
              // Remove participant limit
              maxUsers: 100,
              channelLastN: -1, // -1 means no limit
              // Disable participant limit warnings
              enableInsecureRoomNameWarning: false,
            },
            interfaceConfigOverwrite: {
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
              // Enable toolbar buttons for students
              TOOLBAR_BUTTONS: [
                'microphone',      // Mute/unmute audio
                'camera',          // Start/stop video
                'closedcaptions',  // Closed captions
                'desktop',         // Screen sharing
                'fullscreen',      // Fullscreen
                'fodeviceselection', // Audio/video device selection
                'hangup',         // Leave meeting
                'profile',        // Profile settings
                'chat',          // Chat panel
                'settings',      // Settings
                'raisehand',     // Raise hand
                'videoquality',  // Video quality settings
                'filmstrip',     // Filmstrip view
                'feedback',      // Feedback
                'stats',         // Connection stats
                'shortcuts',     // Keyboard shortcuts
                'tileview',      // Tile view
                'videobackgroundblur', // Background blur
                'help',          // Help
                'toggle-camera', // Toggle camera
                'select-background', // Virtual background
              ],
              NATIVE_APP_NAME: 'Evolvix',
              PROVIDER_NAME: 'Evolvix',
            },
            userInfo: {
              displayName: studentName,
              email: studentEmail,
            },
          };

          // @ts-ignore
          const api = new window.JitsiMeetExternalAPI(domain, options);
          jitsiAPIRef.current = api;
          
          api.addEventListener('videoConferenceJoined', () => {
            console.log('Student joined Jitsi meeting');
          });

          api.addEventListener('readyToClose', () => {
            setIsJoined(false);
            onClose();
          });

          // Handle lobby (waiting room) events
          api.addEventListener('lobbyParticipantJoined', () => {
            console.log('Student is in waiting room');
          });

          api.addEventListener('lobbyParticipantLeft', () => {
            console.log('Student left waiting room');
          });

          (jitsiContainerRef.current as any).jitsiAPI = api;
        }
      };

      document.body.appendChild(script);

      return () => {
        if ((jitsiContainerRef.current as any)?.jitsiAPI) {
          (jitsiContainerRef.current as any).jitsiAPI.dispose();
        }
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isJoined, classItem.meetingId, studentName, studentEmail, onClose]);

  const handleJoin = () => {
    setIsJoined(true);
    setCanJoin(true);
  };

  const handleLeave = () => {
    setIsJoined(false);
    if ((jitsiContainerRef.current as any)?.jitsiAPI) {
      (jitsiContainerRef.current as any).jitsiAPI.dispose();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold">{classItem.topic}</h3>
              <div className="flex items-center space-x-4 text-blue-100 text-sm mt-1">
                <span>{classItem.date} at {classItem.time}</span>
                <span>•</span>
                <span>{classItem.duration} min</span>
                <span>•</span>
                <span>{classItem.courseName}</span>
              </div>
            </div>
            <Button 
              onClick={isJoined ? handleLeave : onClose} 
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              {isJoined ? 'Leave Class' : 'Close'}
            </Button>
          </div>
        </div>

        {/* Join Button / Timer Display */}
        {!isJoined && (
          <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                {!canJoin && timeUntil ? (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Class starts in:</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {timeUntil.hours > 0 && `${timeUntil.hours}h `}{timeUntil.minutes}m
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Ready to join
                    </p>
                  </div>
                )}
              </div>
              <Button
                onClick={handleJoin}
                disabled={!canJoin}
                className={`${
                  canJoin 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                } font-semibold px-6 shadow-lg`}
              >
                <Video className="w-4 h-4 mr-2" />
                Join Class
              </Button>
            </div>
          </div>
        )}

        {/* Jitsi Meet Container */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {!isJoined ? (
            <div className="flex-1 flex items-center justify-center text-white">
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Click "Join Class" to enter the meeting</p>
                <p className="text-sm opacity-75">Meeting Room: {classItem.meetingId}</p>
                {!canJoin && timeUntil && (
                  <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm">Please wait until the class start time</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 relative">
              <div 
                ref={jitsiContainerRef} 
                className="w-full h-full"
                style={{ minHeight: '600px' }}
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center z-10">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                LIVE
              </div>
            </div>
          )}

          {/* Meeting Info */}
          {isJoined && (
            <div className="bg-slate-800 p-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-xs text-slate-400">Meeting Link</p>
                    <p className="text-sm text-white font-mono break-all">
                      {classItem.meetingLink}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(classItem.meetingLink || '');
                    alert('Meeting link copied to clipboard!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

