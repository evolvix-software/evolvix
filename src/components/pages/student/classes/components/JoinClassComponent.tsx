"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/common/forms/Button';
import { Clock, VideoIcon, Share2, MessageSquare, Send } from 'lucide-react';
import { MentorClass } from '@/store/features/classes/classesSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addChatMessage, updateAttendance } from '@/store/features/classes/classesSlice';

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
  const dispatch = useAppDispatch();
  const { chatMessages } = useAppSelector((state) => state.classes);
  const [activeTab, setActiveTab] = useState<'video' | 'chat'>('video');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [canJoin, setCanJoin] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiAPIRef = useRef<any>(null);

  // Get chat messages for this class
  const classChatMessages = chatMessages.filter(m => m.classId === classItem.id);
  const studentId = studentEmail;

  // Calculate if class time has arrived (15 minutes before)
  useEffect(() => {
    const checkClassTime = () => {
      if (!classItem.date || !classItem.time) {
        setCanJoin(true);
        return;
      }

      const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
      const now = new Date();
      // Allow joining 15 minutes before class time
      const joinTime = new Date(classDateTime.getTime() - 15 * 60 * 1000);
      
      if (now >= joinTime) {
        setCanJoin(true);
      } else {
        setCanJoin(false);
        const timeUntilJoin = joinTime.getTime() - now.getTime();
        setTimeout(() => {
          setCanJoin(true);
        }, timeUntilJoin);
      }
    };

    checkClassTime();
    const interval = setInterval(checkClassTime, 60000);

    return () => clearInterval(interval);
  }, [classItem.date, classItem.time]);

  // Timer for elapsed time
  useEffect(() => {
    if (isJoined) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isJoined]);

  // Format time (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get time until class starts
  const getTimeUntilClass = () => {
    if (!classItem.date || !classItem.time) return null;
    
    const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
    const now = new Date();
    const diff = classDateTime.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const timeUntil = getTimeUntilClass();

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
              // Recording and streaming - students can't control
              enableRecording: false,
              enableLiveStreaming: false,
              // Chat and other features
              enableChat: true,
              enableClosePage: true,
              // Security
              requireDisplayName: true,
              // Remove participant limit
              maxUsers: 100,
              channelLastN: -1,
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
          
          // Mark attendance when student joins
          api.addEventListener('videoConferenceJoined', () => {
            console.log('Student joined Jitsi meeting');
            // Auto-mark attendance
            dispatch(updateAttendance({
              classId: classItem.id,
              studentId: studentId,
              studentName: studentName,
              joinedAt: new Date().toISOString(),
            }));
          });

          api.addEventListener('readyToClose', () => {
            setIsJoined(false);
            onClose();
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
  }, [isJoined, classItem.meetingId, classItem.id, studentName, studentEmail, studentId, dispatch, onClose]);

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

  const handleSendChatMessage = (message: string) => {
    if (!message.trim()) return;
    
    dispatch(addChatMessage({
      id: `msg_${Date.now()}`,
      classId: classItem.id,
      senderId: studentId,
      senderName: studentName,
      message: message,
      timestamp: new Date().toISOString(),
    }));
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden" style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <div className="bg-card dark:bg-slate-800 w-full h-full flex flex-col overflow-hidden" style={{ borderRadius: 0 }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold">{classItem.topic}</h3>
              <div className="flex items-center space-x-4 text-white/90 text-sm mt-1">
                <span>{classItem.date} at {classItem.time}</span>
                <span>•</span>
                <span>{classItem.duration} min</span>
                {isJoined && (
                  <>
                <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Live: {formatTime(timeElapsed)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isJoined && classItem.meetingLink && (
                <>
                  <Button
                    onClick={() => {
                      window.open(classItem.meetingLink, '_blank', 'width=1920,height=1080');
                    }}
                    className="bg-card/20 hover:bg-card/30 text-white border-0"
                    size="sm"
                    title="Open in new tab for unlimited participants"
                  >
                    <VideoIcon className="w-4 h-4 mr-1" />
                    Fullscreen
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(classItem.meetingLink || '');
                      alert('Meeting link copied to clipboard!');
                    }}
                    className="bg-card/20 hover:bg-card/30 text-white border-0"
                    size="sm"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>
                </>
              )}
            <Button 
              onClick={isJoined ? handleLeave : onClose} 
              className="bg-card/20 hover:bg-card/30 text-white border-0"
            >
              {isJoined ? 'Leave Class' : 'Close'}
            </Button>
            </div>
          </div>
        </div>

        {/* Join Button / Timer Display */}
        {!isJoined && (
          <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                {!canJoin && timeUntil ? (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary dark:text-primary" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Class starts in:</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-foreground">
                        {timeUntil.hours > 0 && `${timeUntil.hours}h `}{timeUntil.minutes}m
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-sm font-medium text-slate-900 dark:text-foreground">
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
                    ? 'bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white shadow-lg' 
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                } font-semibold px-6`}
              >
                <VideoIcon className="w-4 h-4 mr-2" />
                Join Class
              </Button>
            </div>
          </div>
        )}

        {/* Tabs - Students only see Video and Chat */}
        {isJoined && (
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800">
            {[
              { id: 'video', label: 'Live Video', icon: VideoIcon, count: null },
              { id: 'chat', label: 'Chat', icon: MessageSquare, count: classChatMessages.length },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-[#635bff] dark:border-[#735fff] text-primary dark:text-primary bg-primary/5 dark:bg-primary/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-primary dark:bg-primary text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex" style={{ minHeight: 0, height: '100%' }}>
          {/* Video Tab - Jitsi Meet */}
          {activeTab === 'video' && (
            <div className="flex-1 flex flex-col bg-slate-900" style={{ minHeight: 0, height: '100%', overflow: 'hidden' }}>
          {!isJoined ? (
            <div className="flex-1 flex items-center justify-center text-white">
                  <div className="text-center max-w-md px-4">
                    <VideoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Click "Join Class" to enter the meeting</p>
                    <p className="text-sm opacity-75 mb-4">Meeting Room: {classItem.meetingId}</p>
                    {classItem.meetingLink && (
                      <div className="space-y-2">
                        <p className="text-xs opacity-60 mb-2">
                          Note: Embedded view is limited to 6 participants. For unlimited participants, open in new tab.
                        </p>
                        <Button
                          onClick={() => window.open(classItem.meetingLink, '_blank', 'width=1920,height=1080')}
                          className="bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white border-0"
                        >
                          <VideoIcon className="w-4 h-4 mr-2" />
                          Open in New Tab (Unlimited Participants)
                        </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
                <div className="flex-1 relative" style={{ minHeight: 0, height: '100%', width: '100%', overflow: 'hidden' }}>
              <div 
                ref={jitsiContainerRef} 
                className="w-full h-full"
                    style={{ height: '100%', width: '100%', minHeight: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center z-10 shadow-lg">
                <div className="w-2 h-2 bg-card rounded-full mr-2 animate-pulse" />
                    LIVE - {formatTime(timeElapsed)}
                  </div>
                  {classItem.meetingLink && (
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        onClick={() => {
                          window.open(classItem.meetingLink, '_blank', 'width=1920,height=1080');
                        }}
                        className="bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white text-xs border-0 shadow-lg"
                        size="sm"
                        title="Open in new tab for unlimited participants (bypasses 6 participant limit)"
                      >
                        <VideoIcon className="w-3.5 h-3.5 mr-1" />
                        Fullscreen (Unlimited)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col bg-card dark:bg-slate-800">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {classChatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  classChatMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-lg ${
                        message.senderId === studentId
                          ? 'bg-gradient-to-r from-primary to-primary text-white ml-auto max-w-[80%]'
                          : 'bg-slate-100 dark:bg-slate-700 mr-auto max-w-[80%]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-semibold ${
                          message.senderId === studentId
                            ? 'text-white'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {message.senderName}
                        </span>
                        <span className={`text-xs ${
                          message.senderId === studentId
                            ? 'text-white/80'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        message.senderId === studentId
                          ? 'text-white'
                          : 'text-slate-900 dark:text-foreground'
                      }`}>
                        {message.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-card dark:bg-slate-800">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && chatInput.trim()) {
                        handleSendChatMessage(chatInput);
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground focus:border-[#635bff] dark:focus:border-[#735fff] focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/20"
                  />
                  <Button 
                    onClick={() => handleSendChatMessage(chatInput)}
                    className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white border-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
