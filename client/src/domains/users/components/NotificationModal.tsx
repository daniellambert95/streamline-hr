import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaTrash, FaBell, FaSearch, FaRegCircle, FaCalendarAlt, 
  FaSlack, FaEnvelope, FaExclamationCircle, FaCheckCircle, FaPlus, 
  FaExternalLinkAlt, FaClock
} from 'react-icons/fa';
import { Notification } from '../types/notification.types';
import api from '../../../core/api/apiClient';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useSidebar } from '../../../core/context/SidebarContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  initialNotificationId?: number;
}

type NotificationFilter = {
  id: string;
  name: string;
  icon: React.ReactNode;
  filter: (notification: Notification) => boolean;
};

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  initialNotificationId
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    message: '',
    reminder_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
    external_delivery: {
      slack: false,
      email: false,
      slack_channel: '',
      email_address: ''
    }
  });

  const { isSidebarCollapsed } = useSidebar();

  // Define notification filters
  const notificationFilters: NotificationFilter[] = [
    {
      id: 'all',
      name: 'All Notifications',
      icon: <FaBell className="text-indigo-600" />,
      filter: () => true // All notifications
    },
    {
      id: 'unread',
      name: 'Unread',
      icon: <FaRegCircle className="text-blue-600" />,
      filter: (notification) => !notification.is_read
    },
    {
      id: 'read',
      name: 'Read',
      icon: <FaCheckCircle className="text-green-600" />,
      filter: (notification) => notification.is_read
    },
    {
      id: 'reminders',
      name: 'Reminders',
      icon: <FaClock className="text-orange-500" />,
      filter: (notification) => notification.is_reminder
    },
    {
      id: 'external',
      name: 'External Delivery',
      icon: <FaExternalLinkAlt className="text-purple-600" />,
      filter: (notification) => !!notification.external_delivery && 
        (notification.external_delivery?.slack === true || notification.external_delivery?.email === true)
    } 
  ];

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialNotificationId) {
      // Logic to handle the specific notification
      // For example, you might want to scroll to it or highlight it
    }
  }, [isOpen, initialNotificationId]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ notifications: Notification[] }>('/api/v1/users/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/api/v1/users/notifications/${id}/read`);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, is_read: true } : notification
      ));
      onUpdate();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const markAsUnread = async (id: number) => {
    try {
      await api.put(`/api/v1/users/notifications/${id}/unread`);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, is_read: false } : notification
      ));
      onUpdate();
    } catch (error) {
      console.error('Failed to mark notification as unread:', error);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      // Get all unread notifications in the current filter
      const currentFilter = notificationFilters.find(filter => filter.id === activeFilter);
      const unreadNotifications = notifications.filter(notification => 
        !notification.is_read && (currentFilter ? currentFilter.filter(notification) : true)
      );
      
      if (unreadNotifications.length === 0) {
        toast.error('No unread notifications to mark as read');
        return;
      }
      
      // Mark each notification as read
      await Promise.all(
        unreadNotifications.map(notification => 
          api.put(`/api/v1/users/notifications/${notification.id}/read`)
        )
      );
      
      // Update local state
      setNotifications(notifications.map(notification => 
        unreadNotifications.some(n => n.id === notification.id) 
          ? { ...notification, is_read: true } 
          : notification
      ));
      
      onUpdate();
      toast.success(`Marked ${unreadNotifications.length} notifications as read`);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/api/v1/users/notifications/${id}`);
      setNotifications(notifications.filter(notification => notification.id !== id));
      onUpdate();
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const createReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReminder.message) {
      toast.error('Please enter a reminder message');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('/api/v1/users/reminders', {
        message: newReminder.message,
        reminder_date: newReminder.reminder_date,
        external_delivery: newReminder.external_delivery
      });
      
      setIsCreatingReminder(false);
      setNewReminder({
        message: '',
        reminder_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        external_delivery: {
          slack: false,
          email: false,
          slack_channel: '',
          email_address: ''
        }
      });
      
      fetchNotifications();
      toast.success('Reminder created successfully');
    } catch (error) {
      console.error('Failed to create reminder:', error);
      toast.error('Failed to create reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({ ...prev, [name]: value }));
  };

  const handleExternalDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewReminder(prev => ({
      ...prev,
      external_delivery: {
        ...prev.external_delivery,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Filter notifications based on active filter and search term
  const filteredNotifications = notifications.filter(notification => {
    // First apply text search
    const matchesSearch = searchTerm === '' || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Then apply filter
    const currentFilter = notificationFilters.find(filter => filter.id === activeFilter);
    return currentFilter ? currentFilter.filter(notification) : true;
  });

  // Get count of unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Get counts for each filter
  const getCategoryCount = (filterId: string) => {
    const filter = notificationFilters.find(f => f.id === filterId);
    if (!filter) return 0;
    return notifications.filter(n => filter.filter(n)).length;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50" 
      style={{ 
        margin: 0,
        display: 'grid',
        placeItems: 'center',
        paddingLeft: isSidebarCollapsed ? '5rem' : '17rem', // Responsive to sidebar state
        paddingRight: '1rem',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }} 
      onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-hidden"
        style={{
          maxWidth: isSidebarCollapsed ? 'calc(100vw - 6rem)' : 'calc(100vw - 18rem)' // Responsive to sidebar state
        }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <FaBell className="text-indigo-600 mr-2 text-xl" />
            <h2 className="text-xl font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-12 h-[calc(90vh-4rem)] overflow-hidden">
          {/* Sidebar */}
          <div className="col-span-3 border-r p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filters</h3>
              <button
                onClick={() => setIsCreatingReminder(!isCreatingReminder)}
                className="text-indigo-600 hover:text-indigo-800"
                title="Create Reminder"
              >
                {isCreatingReminder ? 'Cancel' : <FaPlus />}
              </button>
            </div>
            
            {/* Filter categories */}
            <div className="mb-6">
              <ul className="space-y-1">
                {notificationFilters.map(filter => {
                  const count = getCategoryCount(filter.id);
                  return (
                    <li key={filter.id}>
                      <button
                        onClick={() => setActiveFilter(filter.id)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                          activeFilter === filter.id 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          {filter.icon}
                          <span className="ml-2">{filter.name}</span>
                        </div>
                        {count > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            filter.id === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {/* Mark all as read button */}
            <div className="px-2 mt-4">
              <button
                onClick={markAllAsRead}
                className="flex items-center justify-center w-full px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <FaCheckCircle className="mr-2" />
                Mark All as Read
              </button>
            </div>
            
            {/* Search */}
            <div className="px-2 mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-9 flex flex-col h-full overflow-hidden">
            {isCreatingReminder ? (
              <form onSubmit={createReminder} className="p-4 space-y-4 overflow-y-auto flex-1">
                <h3 className="text-lg font-medium text-gray-900">Create New Reminder</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Message:</label>
                  <textarea 
                    name="message"
                    value={newReminder.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                    required
                    placeholder="Enter your reminder message here..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date:</label>
                  <DatePicker
                    selected={newReminder.reminder_date}
                    onChange={(date: Date | null) => setNewReminder(prev => ({ ...prev, reminder_date: date || new Date() }))}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    minDate={new Date()}
                  />
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-800 mb-2">External Delivery Options</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="slack"
                          name="slack"
                          type="checkbox"
                          checked={newReminder.external_delivery.slack}
                          onChange={handleExternalDeliveryChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="slack" className="text-sm font-medium text-gray-700">Send to Slack</label>
                        {newReminder.external_delivery.slack && (
                          <input
                            type="text"
                            name="slack_channel"
                            value={newReminder.external_delivery.slack_channel}
                            onChange={handleExternalDeliveryChange}
                            placeholder="Enter Slack channel (e.g. #general)"
                            className="mt-1 w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email"
                          name="email"
                          type="checkbox"
                          checked={newReminder.external_delivery.email}
                          onChange={handleExternalDeliveryChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Send to Email</label>
                        {newReminder.external_delivery.email && (
                          <input
                            type="email"
                            name="email_address"
                            value={newReminder.external_delivery.email_address}
                            onChange={handleExternalDeliveryChange}
                            placeholder="Enter email address"
                            className="mt-1 w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsCreatingReminder(false);
                      setNewReminder({
                        message: '',
                        reminder_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        external_delivery: {
                          slack: false,
                          email: false,
                          slack_channel: '',
                          email_address: ''
                        }
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <FaPlus size={12} /> Create Reminder
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Notification list */}
                <div className="overflow-y-auto flex-1">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : filteredNotifications.length > 0 ? (
                    <ul className="divide-y">
                      {filteredNotifications.map(notification => (
                        <li 
                          key={notification.id} 
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notification.is_read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            {/* Icon based on notification type */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              notification.is_reminder 
                                ? 'bg-orange-100 text-orange-600' 
                                : notification.type === 'application' 
                                  ? 'bg-green-100 text-green-600'
                                  : notification.type === 'meeting'
                                    ? 'bg-blue-100 text-blue-600'
                                    : notification.type === 'review'
                                      ? 'bg-purple-100 text-purple-600'
                                      : 'bg-indigo-100 text-indigo-600'
                            }`}>
                              {notification.is_reminder ? (
                                <FaClock />
                              ) : notification.type === 'application' ? (
                                <FaExclamationCircle />
                              ) : notification.type === 'meeting' ? (
                                <FaCalendarAlt />
                              ) : notification.type === 'review' ? (
                                <FaCheckCircle />
                              ) : (
                                <FaBell />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <span className={`text-sm font-medium ${!notification.is_read ? 'text-indigo-800 font-semibold' : ''}`}>
                                  {notification.is_reminder ? 'Reminder' : notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                </span>
                                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className={`text-sm mt-1 ${!notification.is_read ? 'text-indigo-800' : 'text-gray-700'}`}>
                                {notification.message}
                              </p>
                              
                              {/* Show reminder date if it's a reminder */}
                              {notification.is_reminder && notification.reminder_date && (
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <FaClock className="mr-1" size={12} />
                                  <span>
                                    {new Date(notification.reminder_date).toLocaleString()}
                                  </span>
                                </div>
                              )}
                              
                              {/* Show external delivery options if any */}
                              {notification.external_delivery && (
                                <div className="flex items-center mt-2 space-x-2">
                                  {notification.external_delivery.slack && (
                                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                                      <FaSlack className="mr-1" size={10} />
                                      Slack
                                    </span>
                                  )}
                                  {notification.external_delivery.email && (
                                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                      <FaEnvelope className="mr-1" size={10} />
                                      Email
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Tags for notification status */}
                              {!notification.is_read && (
                                <div className="mt-2">
                                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                                    new
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                              {notification.is_read ? (
                                <button 
                                  onClick={() => markAsUnread(notification.id)}
                                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                  title="Mark as unread"
                                >
                                  <FaRegCircle size={14} />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Mark as read"
                                >
                                  <FaCheckCircle size={14} />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <FaBell className="text-4xl mb-4 text-gray-300" />
                      <p className="text-lg">No notifications found</p>
                      {searchTerm && (
                        <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
                      )}
                      {activeFilter !== 'all' && (
                        <button
                          onClick={() => setActiveFilter('all')}
                          className="mt-4 text-indigo-600 hover:text-indigo-800"
                        >
                          View all notifications
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 