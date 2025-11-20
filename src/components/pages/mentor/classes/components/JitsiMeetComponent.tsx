"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/common/forms/Button';
import { X, Clock, Users, Mic, MicOff, VideoIcon, VideoOff, Share2, Settings, MessageSquare, UserCheck, Send, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { MentorClass, ChatMessage, Attendance } from '@/store/features/classes/classesSlice';

interface JitsiMeetComponentProps {
  classItem: MentorClass;
  chatMessages: ChatMessage[];
  attendance: Attendance[];
  onClose: () => void;
  onEndClass: () => void;
  onSendChatMessage: (message: string) => void;
  chatInput: string;
  onChatInputChange: (value: string) => void;
}

export function JitsiMeetComponent({
  classItem,
  chatMessages,
  attendance,
  onClose,
  onEndClass,
  onSendChatMessage,
  chatInput,
  onChatInputChange,
}: JitsiMeetComponentProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'attendance' | 'waiting'>('video');
  const [timeElapsed, setTimeElapsed] = useState(0); // Time elapsed since class started (in seconds)
  const [canJoin, setCanJoin] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [waitingParticipants, setWaitingParticipants] = useState<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiAPIRef = useRef<any>(null);

  // Calculate if class time has arrived
  useEffect(() => {
    const checkClassTime = () => {
      if (!classItem.date || !classItem.time) {
        setCanJoin(true); // If no schedule, allow immediate join
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
        // Set timeout to enable join button at the right time
        const timeUntilJoin = joinTime.getTime() - now.getTime();
        setTimeout(() => {
          setCanJoin(true);
        }, timeUntilJoin);
      }
    };

    checkClassTime();
    const interval = setInterval(checkClassTime, 60000); // Check every minute

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

  // Initialize Jitsi Meet
  useEffect(() => {
    if (isJoined && jitsiContainerRef.current && classItem.meetingId) {
      // Load Jitsi Meet script dynamically
      const script = document.createElement('script');
      script.src = 'https://8x8.vc/external_api.js';
      script.async = true;
      
      script.onload = () => {
        // @ts-ignore - JitsiMeetExternalAPI is loaded dynamically
        if (window.JitsiMeetExternalAPI) {
          const domain = 'meet.jit.si';
          const options = {
            roomName: classItem.meetingId,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            configOverwrite: {
              prejoinPageEnabled: false,
              startWithAudioMuted: false,
              startWithVideoMuted: false,
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
              enableRecording: true,
              enableLiveStreaming: true,
              // Chat and other features
              enableChat: true,
              enableClosePage: true,
              // Performance
              disableDeepLinking: false,
              // Security
              requireDisplayName: false,
              // Remove participant limit (default is 75, but we set higher to allow more)
              // Note: meet.jit.si free tier limits embedded meetings to 6 participants
              // For unlimited participants, consider self-hosted Jitsi or opening meeting in new tab
              maxUsers: 100,
              channelLastN: -1, // -1 means no limit (send video to all participants)
              // Disable P2P for larger meetings (uses server instead)
              p2p: {
                enabled: false,
              },
              // Disable participant limit warnings
              enableInsecureRoomNameWarning: false,
            },
            interfaceConfigOverwrite: {
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
              // Enable all toolbar buttons like Google Meet
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
                'recording',     // Recording
                'livestreaming', // Live streaming
                'etherpad',      // Collaborative notes
                'sharedvideo',   // Share YouTube video
                'settings',      // Settings
                'raisehand',     // Raise hand
                'videoquality',  // Video quality settings
                'filmstrip',     // Filmstrip view
                'invite',        // Invite participants
                'feedback',      // Feedback
                'stats',         // Connection stats
                'shortcuts',     // Keyboard shortcuts
                'tileview',      // Tile view
                'videobackgroundblur', // Background blur
                'download',      // Download
                'help',          // Help
                'mute-everyone', // Mute everyone
                'security',      // Security settings
                'toggle-camera', // Toggle camera
                'select-background', // Virtual background
              ],
              // Additional UI configurations
              HIDE_INVITE_MORE_HEADER: false,
              DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
              DISABLE_FOCUS_INDICATOR: false,
              DISABLE_PRESENCE_STATUS: false,
              DISABLE_RINGING: false,
              MOBILE_APP_PROMO: false,
              NATIVE_APP_NAME: 'Evolvix',
              PROVIDER_NAME: 'Evolvix',
            },
            userInfo: {
              displayName: 'Mentor',
              email: 'mentor@evolvix.com',
            },
          };

          // @ts-ignore
          const api = new window.JitsiMeetExternalAPI(domain, options);
          jitsiAPIRef.current = api;
          
          // Set moderator privileges
          api.executeCommand('displayName', 'Mentor');
          
          // Remove participant limit by setting maxUsers after joining
          api.addEventListener('videoConferenceJoined', () => {
            console.log('Mentor joined Jitsi meeting');
            // Set as moderator to control waiting room
            api.executeCommand('toggleLobby', false);
            
            // Try to remove participant limit (if supported)
            try {
              // Set max users to allow more participants
              api.executeCommand('setVideoQuality', {
                maxUsers: 100,
                channelLastN: -1
              });
            } catch (e) {
              console.log('Could not set participant limit:', e);
            }
          });

          // Handle participants joining (waiting room)
          api.addEventListener('participantJoined', (participant: any) => {
            console.log('Participant joined:', participant);
            // Check if participant is in lobby (waiting room)
            if (participant.lobby) {
              setWaitingParticipants((prev) => [...prev, participant]);
            }
          });

          // Handle participants leaving
          api.addEventListener('participantLeft', (participant: any) => {
            console.log('Participant left:', participant);
            setWaitingParticipants((prev) => 
              prev.filter((p) => p.id !== participant.id)
            );
          });

          // Handle lobby events (waiting room)
          api.addEventListener('lobbyParticipantJoined', (participant: any) => {
            console.log('Participant in waiting room:', participant);
            setWaitingParticipants((prev) => {
              if (!prev.find((p) => p.id === participant.id)) {
                return [...prev, participant];
              }
              return prev;
            });
          });

          api.addEventListener('readyToClose', () => {
            setIsJoined(false);
            onEndClass();
          });

          // Store API instance for cleanup
          (jitsiContainerRef.current as any).jitsiAPI = api;
        }
      };

      document.body.appendChild(script);

      return () => {
        // Cleanup
        if ((jitsiContainerRef.current as any)?.jitsiAPI) {
          (jitsiContainerRef.current as any).jitsiAPI.dispose();
        }
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isJoined, classItem.meetingId, onEndClass]);

  const handleJoin = () => {
    setIsJoined(true);
    setCanJoin(true);
  };

  const handleLeave = () => {
    setIsJoined(false);
    if ((jitsiContainerRef.current as any)?.jitsiAPI) {
      (jitsiContainerRef.current as any).jitsiAPI.dispose();
    }
    onEndClass();
  };

  // Admit participant from waiting room
  const handleAdmitParticipant = (participantId: string) => {
    if (jitsiAPIRef.current) {
      jitsiAPIRef.current.executeCommand('admitLobby', participantId);
      setWaitingParticipants((prev) => prev.filter((p) => p.id !== participantId));
    }
  };

  // Deny participant from waiting room
  const handleDenyParticipant = (participantId: string) => {
    if (jitsiAPIRef.current) {
      jitsiAPIRef.current.executeCommand('denyLobby', participantId);
      setWaitingParticipants((prev) => prev.filter((p) => p.id !== participantId));
    }
  };

  // Admit all participants
  const handleAdmitAll = () => {
    if (jitsiAPIRef.current) {
      waitingParticipants.forEach((participant) => {
        jitsiAPIRef.current.executeCommand('admitLobby', participant.id);
      });
      setWaitingParticipants([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden" style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <div className="bg-card dark:bg-slate-800 w-full h-full flex flex-col overflow-hidden" style={{ borderRadius: 0 }}>
        {/* Header */}
        <div className="bg-slate-700 dark:bg-slate-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold">{classItem.topic}</h3>
              <div className="flex items-center space-x-4 text-slate-200 text-sm mt-1">
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
                    Open Fullscreen
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
                    <Clock className="w-5 h-5 text-slate-200" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Class starts in:</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-foreground">
                        {timeUntil.hours > 0 && `${timeUntil.hours}h `}{timeUntil.minutes}m
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse" />
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
                    ? 'bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0' 
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                } font-semibold px-6 shadow-lg`}
              >
                Join Class
              </Button>
            </div>
          </div>
        )}

        {/* Waiting Room Notification Banner */}
        {isJoined && waitingParticipants.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-foreground">
                  {waitingParticipants.length} {waitingParticipants.length === 1 ? 'participant' : 'participants'} waiting to join
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleAdmitAll}
                  size="sm"
                  className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs border-0"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Admit All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        {isJoined && (
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800">
            {[
              { id: 'video', label: 'Live Video', icon: VideoIcon, count: null },
              { id: 'chat', label: 'Chat', icon: MessageSquare, count: chatMessages.length },
              { id: 'attendance', label: 'Attendance', icon: UserCheck, count: `${attendance.length}/${classItem.enrolledStudents.length}` },
              ...(waitingParticipants.length > 0 ? [{ id: 'waiting', label: 'Waiting Room', icon: UserPlus, count: waitingParticipants.length }] : []),
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-slate-600 text-slate-900 dark:text-foreground bg-slate-50 dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-slate-700 dark:bg-slate-600 text-white' 
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
                    <p className="text-lg mb-2">Click "Join Class" to start the meeting</p>
                    <p className="text-sm opacity-75 mb-4">Meeting Room: {classItem.meetingId}</p>
                    {classItem.meetingLink && (
                      <div className="space-y-2">
                        <p className="text-xs opacity-60 mb-2">
                          Note: Embedded view is limited to 6 participants. For unlimited participants, open in new tab.
                        </p>
                        <Button
                          onClick={() => window.open(classItem.meetingLink, '_blank', 'width=1920,height=1080')}
                          className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
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
                  <div className="absolute top-4 left-4 bg-slate-700 dark:bg-slate-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center z-10">
                    <div className="w-2 h-2 bg-card rounded-full mr-2 animate-pulse" />
                    LIVE - {formatTime(timeElapsed)}
                  </div>
                  {classItem.meetingLink && (
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        onClick={() => {
                          window.open(classItem.meetingLink, '_blank', 'width=1920,height=1080');
                        }}
                        className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs border-0"
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

              {/* Meeting Info - Removed to maximize video space */}
              {/* Meeting link is available in header or can be accessed via Jitsi's invite button */}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col bg-card dark:bg-slate-800">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-lg ${
                        message.senderId === 'mentor'
                          ? 'bg-slate-100 dark:bg-slate-800 ml-auto max-w-[80%]'
                          : 'bg-slate-100 dark:bg-slate-700 mr-auto max-w-[80%]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-semibold ${
                          message.senderId === 'mentor'
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {message.senderName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        message.senderId === 'mentor'
                          ? 'text-slate-900 dark:text-foreground'
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
                    onChange={(e) => onChatInputChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && chatInput.trim()) {
                        onSendChatMessage(chatInput);
                        onChatInputChange('');
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                  />
                  <Button 
                    onClick={() => {
                      if (chatInput.trim()) {
                        onSendChatMessage(chatInput);
                        onChatInputChange('');
                      }
                    }}
                    className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Waiting Room Tab */}
          {activeTab === 'waiting' && (
            <div className="flex-1 overflow-y-auto p-6 bg-card dark:bg-slate-800">
              <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Waiting Room</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                      {waitingParticipants.length} {waitingParticipants.length === 1 ? 'Participant' : 'Participants'}
                    </p>
                  </div>
                  <UserPlus className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              <div className="space-y-3">
                {waitingParticipants.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold mb-2">No one waiting</p>
                    <p className="text-sm">All participants have been admitted</p>
                  </div>
                ) : (
                  waitingParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                          {participant.displayName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-foreground">
                            {participant.displayName || 'Unknown User'}
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            Waiting to join...
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleAdmitParticipant(participant.id)}
                          className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Admit
                        </Button>
                        <Button
                          onClick={() => handleDenyParticipant(participant.id)}
                          variant="outline"
                          className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="flex-1 overflow-y-auto p-6 bg-card dark:bg-slate-800">
              <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Total Attendance</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                      {attendance.length} / {classItem.enrolledStudents.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              <div className="space-y-3">
                {classItem.enrolledStudents.map((student) => {
                  const attendanceRecord = attendance.find(
                    a => a.studentId === student.id
                  );
                  return (
                    <div
                      key={student.id}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                        attendanceRecord
                          ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          attendanceRecord
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-semibold ${
                            attendanceRecord
                              ? 'text-slate-900 dark:text-foreground'
                              : 'text-slate-900 dark:text-foreground'
                          }`}>
                            {student.name}
                          </p>
                          <p className={`text-sm ${
                            attendanceRecord
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {student.email}
                          </p>
                          {attendanceRecord?.joinedAt && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              Joined: {new Date(attendanceRecord.joinedAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        {attendanceRecord ? (
                          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                            <UserCheck className="w-5 h-5" />
                            <span className="font-semibold">Present</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Clock className="w-5 h-5" />
                            <span>Waiting</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

