import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../domains/auth/context/AuthContext";
import api from "../../core/api/apiClient";
import danielImage from "../../assets/daniel.png";
import VacancyTrends from "../../domains/analytics/components/analytics/VacancyTrends";
import CalanderWidget from "../../domains/dashboard/components/CalanderWidget";
import { getGreeting } from '../../core/utils/greetingUtils';
import { FaBell, FaComments, FaEnvelope, FaEnvelopeOpen, FaPlus, FaUsers } from 'react-icons/fa';
import TaskList from "../../domains/dashboard/components/TaskList";
import { Notification } from "../../domains/users/types/notification.types";
import { Message } from "../../domains/users/types/message.types";
import NotificationModal from "../../domains/users/components/NotificationModal";
import MessageModal from "../../domains/users/components/MessageModal";
import TaskListModal from '../../domains/dashboard/components/TaskListModal';
import { toast } from 'react-hot-toast';

// Import new enhanced components
import EnhancedMetricsCards from "../../domains/dashboard/components/EnhancedMetricsCards";
import QuickActionsPanel from "../../domains/dashboard/components/QuickActionsPanel";
import SmartInsights from "../../domains/dashboard/components/SmartInsights";
import HiringPipeline from "../../domains/dashboard/components/HiringPipeline";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for notifications and messages
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  
  // Single state for active dropdown
  const [activeDropdown, setActiveDropdown] = useState<'notifications' | 'messages' | null>(null);
  
  // Refs for dropdown containers
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  
  // Timeout ref for the active dropdown
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State for modals
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Add these new state variables after the existing modal state variables (around line 40)
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | undefined>(undefined);
  const [selectedMessageId, setSelectedMessageId] = useState<number | undefined>(undefined);
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(undefined);

  // Add this state variable with your other state declarations
  const [isComposingMessage, setIsComposingMessage] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Fetch notifications and messages
    fetchUserData();
    
    // Add click outside listener to close dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current && 
        !notificationsRef.current.contains(event.target as Node) &&
        messagesRef.current && 
        !messagesRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
      // Clear any pending timeouts
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch notifications - this endpoint returns both notifications and unreadCount
      const notificationsResponse = await api.get<{ notifications: Notification[], unreadCount: number }>('/api/v1/users/notifications');
      // Sort by created_at before setting state to maintain order
      const sortedNotifications = notificationsResponse.data.notifications.sort(
        (a: Notification, b: Notification) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setNotifications(sortedNotifications);
      setUnreadNotificationsCount(notificationsResponse.data.unreadCount);
      
      // Fetch messages - this endpoint returns both messages and unreadCount
      const messagesResponse = await api.get<{ messages: Message[], unreadCount: number }>('/api/v1/users/messages');
      // Sort by sent_at before setting state to maintain order
      const sortedMessages = messagesResponse.data.messages.sort(
        (a: Message, b: Message) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
      );
      setMessages(sortedMessages);
      setUnreadMessagesCount(messagesResponse.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };
  
  // Navigation handlers for clicks
  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleMessageClick = () => {
    setIsMessageModalOpen(true);
  };
  
  // Handlers for dropdowns
  const handleDropdownMouseEnter = (dropdown: 'notifications' | 'messages') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };
  
  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // Delay before hiding
  };

  // Add these new handler functions after the existing handler functions (around line 100)
  const handleNotificationItemClick = (notificationId: number) => {
    setSelectedNotificationId(notificationId);
    setIsNotificationModalOpen(true);
    setActiveDropdown(null);
  };

  const handleMessageItemClick = (messageId: number) => {
    setSelectedMessageId(messageId);
    setIsMessageModalOpen(true);
    setActiveDropdown(null);
  };

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleTaskExpandClick = () => {
    setIsTaskModalOpen(true);
  };

  const handleMarkNotificationAsRead = async (notificationId: number) => {
    try {
      await api.put(`/api/v1/users/notifications/${notificationId}/read`);
      // Update local state without changing order
      setNotifications(notifications.map(notification => 
        notification.id === notificationId ? { ...notification, is_read: true } : notification
      ));
      // Update unread count
      setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkNotificationAsUnread = async (notificationId: number) => {
    try {
      await api.put(`/api/v1/users/notifications/${notificationId}/unread`);
      // Update local state without changing order
      setNotifications(notifications.map(notification => 
        notification.id === notificationId ? { ...notification, is_read: false } : notification
      ));
      // Update unread count
      setUnreadNotificationsCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to mark notification as unread:', error);
      toast.error('Failed to mark notification as unread');
    }
  };

  const handleMarkMessageAsRead = async (messageId: number) => {
    try {
      await api.put(`/api/v1/users/messages/${messageId}/read`);
      // Update local state without changing order
      setMessages(messages.map(message => 
        message.id === messageId ? { ...message, is_read: true } : message
      ));
      // Update unread count
      setUnreadMessagesCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const handleMarkMessageAsUnread = async (messageId: number) => {
    try {
      await api.put(`/api/v1/users/messages/${messageId}/unread`);
      // Update local state without changing order
      setMessages(messages.map(message => 
        message.id === messageId ? { ...message, is_read: false } : message
      ));
      // Update unread count
      setUnreadMessagesCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to mark message as unread:', error);
      toast.error('Failed to mark message as unread');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 font-sans">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-2">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user.first_name}</span> 👋
            </h1>
            <p className="text-gray-600 text-lg">Welcome back to your HR dashboard</p>
          </div>
    
          {/* User Profile Section with Notifications */}
          <div className="flex items-center gap-6">
            {/* Notification Icons */}
            <div className="flex items-center gap-4">
              {/* Messages Dropdown */}
              <div 
                ref={messagesRef}
                className="relative"
                onMouseEnter={() => handleDropdownMouseEnter('messages')}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <button 
                  onClick={handleMessageClick}
                  className="relative p-3 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300"
                >
                  <FaComments className="text-gray-700 text-xl" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-lg">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                {/* Messages Dropdown Content */}
                {activeDropdown === 'messages' && (
                  <div className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-10 overflow-hidden border border-white/20">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                      <h3 className="font-semibold text-gray-800">Messages</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsComposingMessage(true);
                          setActiveDropdown(null);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <FaPlus size={10} /> New Message
                      </button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {messages.length > 0 ? (
                        messages.map(message => (
                          <div 
                            key={message.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all duration-200 ${!message.is_read ? 'bg-indigo-50/50' : ''}`}
                            onClick={() => handleMessageItemClick(message.id)}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-semibold text-gray-800">
                                    {message.sender_first_name} {message.sender_last_name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.sent_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-1">{message.subject}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{message.content}</p>
                              </div>
                              <div className="flex space-x-1 ml-3">
                                {message.is_read ? (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkMessageAsUnread(message.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                                    title="Mark as unread"
                                  >
                                    <FaEnvelope size={12} />
                                  </button>
                                ) : (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkMessageAsRead(message.id);
                                    }}
                                    className="text-indigo-400 hover:text-indigo-600 p-1 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <FaEnvelopeOpen size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <FaComments className="mx-auto mb-2 text-2xl text-gray-300" />
                          <p>No messages</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 text-center border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <button 
                        onClick={handleMessageClick}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold hover:underline transition-colors"
                      >
                        View All Messages
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Notifications Dropdown */}
              <div 
                ref={notificationsRef}
                className="relative"
                onMouseEnter={() => handleDropdownMouseEnter('notifications')}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <button 
                  onClick={handleNotificationClick}
                  className="relative p-3 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300"
                >
                  <FaBell className="text-gray-700 text-xl" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-lg">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown Content */}
                {activeDropdown === 'notifications' && (
                  <div className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-10 overflow-hidden border border-white/20">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      {unreadNotificationsCount > 0 && (
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await api.put('/api/v1/users/notifications/read-all');
                              fetchUserData();
                              toast.success('All notifications marked as read');
                            } catch (error) {
                              toast.error('Failed to update notifications');
                            }
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all duration-200 ${!notification.is_read ? 'bg-indigo-50/50' : ''}`}
                            onClick={() => handleNotificationItemClick(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-sm
                                ${notification.type === 'application' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                                  notification.type === 'meeting' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 
                                  'bg-gradient-to-r from-yellow-400 to-orange-500'}`}>
                                <span className="text-white text-lg">
                                  {notification.type === 'application' ? '👤' : 
                                   notification.type === 'meeting' ? '📅' : '📝'}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 truncate max-w-[200px] font-medium">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-1 ml-3">
                                {notification.is_read ? (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkNotificationAsUnread(notification.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                                    title="Mark as unread"
                                  >
                                    <FaEnvelope size={12} />
                                  </button>
                                ) : (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkNotificationAsRead(notification.id);
                                    }}
                                    className="text-indigo-400 hover:text-indigo-600 p-1 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <FaEnvelopeOpen size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <FaBell className="mx-auto mb-2 text-2xl text-gray-300" />
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 text-center border-t border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <button 
                        onClick={handleNotificationClick}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold hover:underline transition-colors"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Link */}
            <Link to="/profile" className="flex items-center gap-4 p-4 border border-white/20 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl hover:bg-white/90 transition-all duration-300">
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-600">{user.company_name}</p>
              </div>
              <img src={danielImage} alt="User" className="ml-4 w-12 h-12 rounded-xl object-cover shadow-md" />
            </Link>
          </div>
        </div>

        {/* Enhanced Metrics Cards Section */}
        <EnhancedMetricsCards />

        {/* Quick Actions Panel */}
        <QuickActionsPanel />

        {/* Smart Insights */}
        <SmartInsights />

        {/* Enhanced Dashboard Widgets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar takes up 2 columns, Tasks takes 1 column */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <CalanderWidget />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <TaskList onTaskClick={handleTaskClick} onExpandClick={handleTaskExpandClick} />
          </div>
        </div>

        {/* Hiring Pipeline Section */}
        <HiringPipeline />

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <CalanderWidget />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <VacancyTrends />
            </div>
          </div>
        </div>

        {/* Upcoming Interview Section */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">📅</span>
            </div>
            Upcoming Interview
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <img src={danielImage} alt="Candidate" className="w-16 h-16 rounded-xl object-cover shadow-lg" />
              <div>
                <p className="text-xl font-bold text-gray-800">James Hatt</p>
                <p className="text-sm text-gray-600 bg-indigo-50 px-3 py-1 rounded-full inline-block">Lead Designer</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center lg:text-right">
                <p className="text-sm text-gray-600 font-medium">Interview Time</p>
                <p className="text-lg font-bold text-gray-800">11:30 AM - 12:45 PM</p>
              </div>
              <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Recent Candidates Table */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <FaUsers className="text-white text-sm" />
            </div>
            Recent Candidates
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-gray-700 text-sm font-semibold border-b border-gray-200">
                  <th className="py-4 px-2">Candidate Name</th>
                  <th className="py-4 px-2">Title</th>
                  <th className="py-4 px-2">Email</th>
                  <th className="py-4 px-2">Created At</th>
                  <th className="py-4 px-2">LinkedIn</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  {
                    id: 1,
                    first_name: "Kevin",
                    last_name: "Michel",
                    email: "kevmichel@gmail.com",
                    title: "Sr. Developer",
                    created_at: "2025-01-01T12:00:00Z",
                    linkedin_url_path: "https://linkedin.com/in/kevinmichel",
                  },
                  {
                    id: 2,
                    first_name: "Tanisha",
                    last_name: "Combs",
                    email: "tanicom@gmail.com",
                    title: "Jr. UX Designer",
                    created_at: "2025-01-02T12:00:00Z",
                    linkedin_url_path: "https://linkedin.com/in/tanishacombs",
                  },
                  {
                    id: 3,
                    first_name: "Aron",
                    last_name: "Armstrong",
                    email: "armsaron@gmail.com",
                    title: "Mid. QA Automation",
                    created_at: "2025-01-03T12:00:00Z",
                    linkedin_url_path: "https://linkedin.com/in/aronarmstrong",
                  },
                  {
                    id: 4,
                    first_name: "Josh",
                    last_name: "Wiggins",
                    email: "wiggijo@gmail.com",
                    title: "Sr. Analytics",
                    created_at: "2025-01-04T12:00:00Z",
                    linkedin_url_path: "https://linkedin.com/in/joshwiggins",
                  },
                  {
                    id: 5,
                    first_name: "Sumaya",
                    last_name: "Oneill",
                    email: "sumone@gmail.com",
                    title: "Sr. Copywriter",
                    created_at: "2025-01-05T12:00:00Z",
                    linkedin_url_path: "https://linkedin.com/in/sumayaoneill",
                  },
                ].map((candidate, index) => (
                  <tr
                    key={candidate.id}
                    className={`transition-colors duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 ${
                      index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"
                    } border-b border-gray-100`}
                  >
                    <td className="py-4 px-2 font-semibold text-gray-800">
                      {candidate.first_name} {candidate.last_name}
                    </td>
                    <td className="py-4 px-2">
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                        {candidate.title}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-600">{candidate.email}</td>
                    <td className="py-4 px-2 text-gray-600">
                      {new Date(candidate.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-2">
                      <a
                        href={candidate.linkedin_url_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
                      >
                        LinkedIn
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {isNotificationModalOpen && (
          <NotificationModal 
            isOpen={isNotificationModalOpen} 
            onClose={() => {
              setIsNotificationModalOpen(false);
              setSelectedNotificationId(undefined);
            }} 
            onUpdate={fetchUserData}
            initialNotificationId={selectedNotificationId}
          />
        )}
        
        {isMessageModalOpen && (
          <MessageModal 
            isOpen={isMessageModalOpen} 
            onClose={() => {
              setIsMessageModalOpen(false);
              setSelectedMessageId(undefined);
              setIsComposingMessage(false);
            }} 
            onUpdate={fetchUserData}
            initialMessageId={selectedMessageId}
            isComposing={isComposingMessage}
            setIsComposing={setIsComposingMessage}
          />
        )}

        {isTaskModalOpen && (
          <TaskListModal 
            isOpen={isTaskModalOpen} 
            onClose={() => {
              setIsTaskModalOpen(false);
              setSelectedTaskId(undefined);
            }} 
            selectedTaskId={selectedTaskId}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;