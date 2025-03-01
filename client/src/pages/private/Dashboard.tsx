import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../domains/auth/context/AuthContext";
import api from "../../core/api/apiClient";
import danielImage from "../../assets/daniel.png";
import VacancyTrends from "../../domains/analytics/components/analytics/VacancyTrends";
import CalanderWidget from "../../domains/dashboard/components/CalanderWidget";
import { getGreeting } from '../../core/utils/greetingUtils';
import { FaBell, FaComments, FaEnvelope, FaEnvelopeOpen, FaPlus, } from 'react-icons/fa';
import TaskList from "../../domains/dashboard/components/TaskList";
import { Notification } from "../../domains/users/types/notification.types";
import { Message } from "../../domains/users/types/message.types";
import NotificationModal from "../../domains/users/components/NotificationModal";
import MessageModal from "../../domains/users/components/MessageModal";
import TaskListModal from '../../domains/dashboard/components/TaskListModal';
import { toast } from 'react-hot-toast';

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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-sans px-6 pb-4 bg-gray-100 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {getGreeting()}, <span className="text-indigo-600">{user.first_name}</span> 👋
        </h1>
  
        {/* User Profile Section with Notifications */}
        <div className="flex items-center gap-4">
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
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <FaComments className="text-gray-600 text-xl" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Messages Dropdown Content */}
              {activeDropdown === 'messages' && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">Messages</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsComposingMessage(true);
                        setActiveDropdown(null);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <FaPlus size={10} /> New Message
                    </button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map(message => (
                        <div 
                          key={message.id}
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!message.is_read ? 'bg-blue-50' : ''}`}
                          onClick={() => handleMessageItemClick(message.id)}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">
                                  {message.sender_first_name} {message.sender_last_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.sent_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm font-medium">{message.subject}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{message.content}</p>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              {message.is_read ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkMessageAsUnread(message.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 p-1"
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
                                  className="text-blue-400 hover:text-blue-600 p-1"
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
                      <div className="p-4 text-center text-gray-500">
                        No messages
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 text-center border-t">
                    <button 
                      onClick={handleMessageClick}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
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
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <FaBell className="text-gray-600 text-xl" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown Content */}
              {activeDropdown === 'notifications' && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
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
                        className="text-xs text-indigo-600 hover:text-indigo-800"
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
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                          onClick={() => handleNotificationItemClick(notification.id)}
                        >
                          <div className="flex items-start">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                              ${notification.type === 'application' ? 'bg-green-100 text-green-600' : 
                                notification.type === 'meeting' ? 'bg-blue-100 text-blue-600' : 
                                'bg-yellow-100 text-yellow-600'}`}>
                              {notification.type === 'application' ? '👤' : 
                               notification.type === 'meeting' ? '📅' : '📝'}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm truncate max-w-[200px]">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              {notification.is_read ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkNotificationAsUnread(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 p-1"
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
                                  className="text-blue-400 hover:text-blue-600 p-1"
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
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 text-center border-t">
                    <button 
                      onClick={handleNotificationClick}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Link */}
          <Link to="/profile" className="flex items-center gap-4 p-4 border rounded-lg shadow bg-white cursor-pointer hover:shadow-lg transition">
            <div>
              <p className="text-sm font-semibold">
                {user.first_name} {user.last_name}
              </p>
              {/* <p className="text-sm text-gray-500">{user.email}</p> */}
              <p className="text-sm text-gray-500">{user.company_name}</p>
            </div>
            <img src={danielImage} alt="User" className="ml-12 w-12 h-12 rounded-full" />
          </Link>

        </div>
      </div>

      {/* Other Dashboard Components */}
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Employees</p>
          <p className="text-3xl font-bold">418</p>
          <p className="text-green-600 text-sm">+7% last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">New Employees</p>
          <p className="text-3xl font-bold">21</p>
          <p className="text-green-600 text-sm">+2% last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Resigned Employees</p>
          <p className="text-3xl font-bold">14</p>
          <p className="text-green-600 text-sm">+4% last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Employees On Leave</p>
          <p className="text-3xl font-bold">4</p>
          <p className="text-green-600 text-sm">-15% less than last usual</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Calendar takes up 2 columns, Tasks takes 1 column */}
        <div className="md:col-span-2">
          <CalanderWidget />
        </div>
        <TaskList />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CalanderWidget />
        <div className="col-span-1 md:col-span-2">
          <VacancyTrends />
        </div>
      </div>

      {/* Upcoming Interview Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-bold">Upcoming Interview</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={danielImage} alt="Candidate" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold">James Hatt</p>
              <p className="text-sm text-gray-500">Lead Designer</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p>11:30 AM - 12:45 AM</p>
            </div>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-md">
              View Details
            </button>
          </div>
        </div>
      </div>
      {/* Candidate Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Candidates</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-indigo-600 text-sm">
              <th className="py-2">Candidate Name</th>
              <th className="py-2">Title</th>
              <th className="py-2">Email</th>
              <th className="py-2">Created At</th>
              <th className="py-2">LinkedIn</th>
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
                created_at: "2023-01-01T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/kevinmichel",
              },
              {
                id: 2,
                first_name: "Tanisha",
                last_name: "Combs",
                email: "tanicom@gmail.com",
                title: "Jr. UX Designer",
                created_at: "2023-01-02T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/tanishacombs",
              },
              {
                id: 3,
                first_name: "Aron",
                last_name: "Armstrong",
                email: "armsaron@gmail.com",
                title: "Mid. QA Automation",
                created_at: "2023-01-03T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/aronarmstrong",
              },
              {
                id: 4,
                first_name: "Josh",
                last_name: "Wiggins",
                email: "wiggijo@gmail.com",
                title: "Sr. Analytics",
                created_at: "2023-01-04T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/joshwiggins",
              },
              {
                id: 5,
                first_name: "Sumaya",
                last_name: "Oneill",
                email: "sumone@gmail.com",
                title: "Sr. Copywriter",
                created_at: "2023-01-05T12:00:00Z",
                linkedin_url_path: "https://linkedin.com/in/sumayaoneill",
              },
            ].map((candidate, index) => (
              <tr
                key={candidate.id}
                className={index % 2 === 0 ? "bg-white" : "bg-indigo-100"}
              >
                <td className="py-2 px-4">
                  {candidate.first_name} {candidate.last_name}
                </td>
                <td className="py-2 px-4">{candidate.title}</td>
                <td className="py-2 px-4">{candidate.email}</td>
                <td className="py-2 px-4">
                  {new Date(candidate.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <a
                    href={candidate.linkedin_url_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    LinkedIn
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          View All
        </button>
      </div>

      {isTaskModalOpen && (
        <TaskListModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)} 
        />
      )}
    </div>
  );
};

// Helper component for displaying info items
const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <h3 className="text-gray-600">{label}</h3>
    <p className="font-medium">{value || 'N/A'}</p>
  </div>
);

export default Dashboard;