import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaTrash, FaPaperPlane, FaPlus, FaSearch, FaEnvelope, FaEnvelopeOpen, 
  FaComments, FaReply, FaArrowLeft, FaInbox, FaStar, FaExclamationCircle } from 'react-icons/fa';
import { Message } from '../types/message.types';
import api from '../../../core/api/apiClient';
import { toast } from 'react-hot-toast';
import { useSidebar } from '../../../core/context/SidebarContext';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  initialMessageId?: number;
  isComposing?: boolean;
  setIsComposing?: React.Dispatch<React.SetStateAction<boolean>>;
}

type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type MessageFolder = {
  id: string;
  name: string;
  icon: React.ReactNode;
  filter: (message: Message) => boolean;
};

const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  initialMessageId,
  isComposing: initialIsComposing = false,
  setIsComposing: externalSetIsComposing = () => {}
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [newMessage, setNewMessage] = useState({
    recipients: [] as number[],
    subject: '',
    content: ''
  });
  const [isComposing, setIsComposing] = useState(initialIsComposing);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
  
  // Ref for the highlighted message
  const highlightedMessageRef = useRef<HTMLLIElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  // Define message folders
  const messageFolders: MessageFolder[] = [
    {
      id: 'inbox',
      name: 'Inbox',
      icon: <FaInbox className="text-primary" />,
      filter: () => true // All messages
    },
    {
      id: 'unread',
      name: 'Unread',
      icon: <FaEnvelope className="text-accent-blue" />,
      filter: (message) => !message.is_read
    },
    {
      id: 'read',
      name: 'Read',
      icon: <FaEnvelopeOpen className="text-accent-green" />,
      filter: (message) => message.is_read
    },
    {
      id: 'important',
      name: 'Important',
      icon: <FaExclamationCircle className="text-accent-orange" />,
      filter: (message) => message.is_important === true
    }
  ];

  // Active folder state
  const [activeFolder, setActiveFolder] = useState<string>('inbox');

  // Sync internal and external isComposing state
  useEffect(() => {
    setIsComposing(initialIsComposing);
  }, [initialIsComposing]);

  useEffect(() => {
    externalSetIsComposing(isComposing);
  }, [isComposing, externalSetIsComposing]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isComposing) {
      fetchEmployees();
    }
  }, [isComposing]);

  // Set viewing message if initialMessageId is provided
  useEffect(() => {
    if (initialMessageId) {
      const message = messages.find(m => m.id === initialMessageId);
      if (message) {
        setViewingMessage(message);
        // Mark as read if it's unread
        if (!message.is_read) {
          markAsRead(message.id);
        }
      }
    }
  }, [initialMessageId, messages]);

  // Scroll to highlighted message if initialMessageId is provided
  useEffect(() => {
    if (initialMessageId && highlightedMessageRef.current) {
      highlightedMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [initialMessageId, messages]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ messages: Message[] }>('/api/v1/users/messages/all');
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get<Employee[]>('/api/v1/users/company-users');
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/api/v1/users/messages/${id}/read`);
      setMessages(messages.map(message => 
        message.id === id ? { ...message, is_read: true } : message
      ));
      onUpdate();
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      toast.error('Failed to update message');
    }
  };

  const markAsUnread = async (id: number) => {
    try {
      await api.put(`/api/v1/users/messages/${id}/unread`);
      setMessages(messages.map(message => 
        message.id === id ? { ...message, is_read: false } : message
      ));
      onUpdate();
      toast.success('Message marked as unread');
    } catch (error) {
      console.error('Failed to mark message as unread:', error);
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await api.delete(`/api/v1/users/messages/${id}`);
      setMessages(messages.filter(message => message.id !== id));
      if (viewingMessage?.id === id) {
        setViewingMessage(null);
      }
      onUpdate();
      toast.success('Message deleted');
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMessage(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSelectEmployee = (employee: Employee) => {
    // Check if employee is already selected
    if (!selectedEmployees.some(e => e.id === employee.id)) {
      const updatedEmployees = [...selectedEmployees, employee];
      setSelectedEmployees(updatedEmployees);
      setNewMessage(prev => ({ 
        ...prev, 
        recipients: updatedEmployees.map(e => e.id) 
      }));
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveEmployee = (employeeId: number) => {
    const updatedEmployees = selectedEmployees.filter(e => e.id !== employeeId);
    setSelectedEmployees(updatedEmployees);
    setNewMessage(prev => ({ 
      ...prev, 
      recipients: updatedEmployees.map(e => e.id) 
    }));
  };

  const filteredEmployees = searchTerm
    ? employees
        .filter(employee => 
          !selectedEmployees.some(e => e.id === employee.id) && (
            employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
    : [];

  // Filter messages based on active folder and search term
  const filteredMessages = messages.filter(message => {
    // First apply text search
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${message.sender_first_name} ${message.sender_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Then apply folder filter
    const currentFolder = messageFolders.find(folder => folder.id === activeFolder);
    return currentFolder ? currentFolder.filter(message) : true;
  });

  // Get count of unread messages
  const unreadCount = messages.filter(m => !m.is_read).length;

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEmployees.length === 0 || !newMessage.subject || !newMessage.content) {
      toast.error('Please select at least one recipient and fill all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      // Send message to each recipient
      await Promise.all(
        selectedEmployees.map(async (employee) => {
          await api.post('/api/v1/users/messages', {
            recipient_id: employee.id,
            subject: newMessage.subject,
            content: newMessage.content
          });
        })
      );
      
      setIsComposing(false);
      setSearchTerm('');
      setSelectedEmployees([]);
      setNewMessage({
        recipients: [],
        subject: '',
        content: ''
      });
      onUpdate();
      toast.success('Message sent successfully');
      fetchMessages(); // Refresh messages list
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const replyToMessage = async (message: Message) => {
    // First, ensure employees are loaded
    if (employees.length === 0) {
      try {
        // Fetch employees first and wait for completion
        const response = await api.get<Employee[]>('/api/v1/users/company-users');
        const fetchedEmployees = response.data;
        setEmployees(fetchedEmployees);
        
        // Now find the sender in the fetched employees
        const sender = fetchedEmployees.find((e: Employee) => 
          e.first_name === message.sender_first_name && 
          e.last_name === message.sender_last_name
        );
        
        if (sender) {
          setSelectedEmployees([sender]);
          setNewMessage({
            recipients: [sender.id],
            subject: `Re: ${message.subject}`,
            content: `\n\n-------- Original Message --------\nFrom: ${message.sender_first_name} ${message.sender_last_name}\nDate: ${new Date(message.sent_at).toLocaleString()}\n\n${message.content}`
          });
          setIsComposing(true);
          setViewingMessage(null);
        } else {
          toast.error('Could not find the sender in your contacts');
        }
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        toast.error('Failed to load employees');
      }
    } else {
      // Employees are already loaded, proceed as before
      const sender = employees.find(e => 
        e.first_name === message.sender_first_name && 
        e.last_name === message.sender_last_name
      );
      
      if (sender) {
        setSelectedEmployees([sender]);
        setNewMessage({
          recipients: [sender.id],
          subject: `Re: ${message.subject}`,
          content: `\n\n-------- Original Message --------\nFrom: ${message.sender_first_name} ${message.sender_last_name}\nDate: ${new Date(message.sent_at).toLocaleString()}\n\n${message.content}`
        });
        setIsComposing(true);
        setViewingMessage(null);
      } else {
        toast.error('Could not find the sender in your contacts');
      }
    }
  };

  // Add this new function to mark all messages as read
  const markAllAsRead = async () => {
    try {
      // Get all unread messages in the current folder
      const currentFolder = messageFolders.find(folder => folder.id === activeFolder);
      const unreadMessages = messages.filter(message => 
        !message.is_read && (currentFolder ? currentFolder.filter(message) : true)
      );
      
      if (unreadMessages.length === 0) {
        toast.error('No unread messages to mark as read');
        return;
      }
      
      // Mark each message as read
      await Promise.all(
        unreadMessages.map(message => api.put(`/api/v1/users/messages/${message.id}/read`))
      );
      
      // Update local state
      setMessages(messages.map(message => 
        unreadMessages.some(m => m.id === message.id) 
          ? { ...message, is_read: true } 
          : message
      ));
      
      onUpdate();
      toast.success(`Marked ${unreadMessages.length} messages as read`);
    } catch (error) {
      console.error('Failed to mark all messages as read:', error);
      toast.error('Failed to update messages');
    }
  };

  // Add this function to toggle importance
  const toggleImportant = async (id: number, isCurrentlyImportant: boolean) => {
    try {
      // This would require a new API endpoint on your backend
      // For now, we'll just update the local state
      // In a real implementation, you would call:
      // await api.put(`/api/v1/users/messages/${id}/${isCurrentlyImportant ? 'unmark-important' : 'mark-important'}`);
      
      setMessages(messages.map(message => 
        message.id === id ? { ...message, is_important: !isCurrentlyImportant } : message
      ));
      
      toast.success(`Message marked as ${isCurrentlyImportant ? 'not important' : 'important'}`);
    } catch (error) {
      console.error('Failed to update message importance:', error);
      toast.error('Failed to update message');
    }
  };

  const { isSidebarCollapsed } = useSidebar();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 modal-overlay"
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
            <FaComments className="text-primary mr-2 text-xl" />
            <h2 className="text-xl font-semibold">Messages</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-12 h-[calc(90vh-4rem)] overflow-hidden">
          {/* Sidebar */}
          <div className="col-span-3 border-r overflow-y-auto">
            {/* Compose button */}
            <div className="p-4">
              <button 
                onClick={() => {
                  setIsComposing(true);
                  setViewingMessage(null);
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <FaPlus size={12} /> New Message
              </button>
            </div>
            
            {/* Folders */}
            <div className="px-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Folders</h3>
              <ul className="space-y-1 mb-4">
                {messageFolders.map(folder => {
                  const count = messages.filter(folder.filter).length;
                  return (
                    <li key={folder.id}>
                      <button
                        onClick={() => {
                          setActiveFolder(folder.id);
                          setViewingMessage(null);
                          setIsComposing(false);
                        }}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm ${
                          activeFolder === folder.id 
                            ? 'bg-primary-100 text-primary-700' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{folder.icon}</span>
                          <span>{folder.name}</span>
                        </div>
                        {count > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            folder.id === 'unread' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-gray-100 text-gray-800'
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
            
            {/* Search */}
            <div className="px-4 mb-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            {/* Mark All as Read button */}
            <div className="px-2 mt-4">
              <button
                onClick={markAllAsRead}
                className="flex items-center justify-center w-full px-3 py-2 text-sm text-primary hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <FaEnvelopeOpen className="mr-2" />
                Mark All as Read
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-9 flex flex-col h-full overflow-hidden">
            {isComposing ? (
              <form onSubmit={sendMessage} className="p-4 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                  
                  {/* Selected recipients tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedEmployees.map(employee => (
                      <div 
                        key={employee.id}
                        className="flex items-center bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm"
                      >
                        <span>{employee.first_name} {employee.last_name}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="ml-1 text-primary-500 hover:text-primary-700"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative" ref={suggestionBoxRef}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for recipients..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                    
                    {/* Employee suggestions */}
                    {showSuggestions && filteredEmployees.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border max-h-60 overflow-auto">
                        {filteredEmployees.map(employee => (
                          <div 
                            key={employee.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectEmployee(employee)}
                          >
                            <div className="font-medium">{employee.first_name} {employee.last_name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {showSuggestions && searchTerm && filteredEmployees.length === 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border p-2 text-center text-gray-500">
                        No matches found
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                  <input 
                    type="text"
                    name="subject"
                    value={newMessage.subject}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                  <textarea 
                    name="content"
                    value={newMessage.content}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsComposing(false);
                      setSearchTerm('');
                      setSelectedEmployees([]);
                      setNewMessage({
                        recipients: [],
                        subject: '',
                        content: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={12} /> Send
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : viewingMessage ? (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Message view header */}
                <div className="p-4 border-b bg-gray-50 flex items-center">
                  <button 
                    onClick={() => setViewingMessage(null)}
                    className="mr-3 text-gray-500 hover:text-primary"
                  >
                    <FaArrowLeft />
                  </button>
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg">{viewingMessage.subject}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>From: {viewingMessage.sender_first_name} {viewingMessage.sender_last_name}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(viewingMessage.sent_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => replyToMessage(viewingMessage)}
                      className="p-2 text-primary hover:text-primary-800 hover:bg-primary-50 rounded-full transition-colors"
                      title="Reply"
                    >
                      <FaReply />
                    </button>
                    <button 
                      onClick={() => viewingMessage.is_read ? markAsUnread(viewingMessage.id) : markAsRead(viewingMessage.id)}
                      className={`p-2 rounded-full transition-colors ${
                        viewingMessage.is_read 
                          ? 'text-gray-400 hover:text-primary hover:bg-primary-50' 
                          : 'text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10'
                      }`}
                      title={viewingMessage.is_read ? "Mark as unread" : "Mark as read"}
                    >
                      {viewingMessage.is_read ? <FaEnvelope /> : <FaEnvelopeOpen />}
                    </button>
                    <button 
                      onClick={() => deleteMessage(viewingMessage.id)}
                      className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-full transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleImportant(viewingMessage.id, !!viewingMessage.is_important);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        viewingMessage.is_important 
                          ? 'text-accent-orange hover:text-accent-orange/80 hover:bg-accent-orange/10' 
                          : 'text-gray-400 hover:text-accent-orange hover:bg-accent-orange/10'
                      }`}
                      title={viewingMessage.is_important ? "Remove importance" : "Mark as important"}
                    >
                      <FaStar size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Message content */}
                <div className="p-6 overflow-y-auto flex-grow">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{viewingMessage.content}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Message list */}
                <div className="overflow-y-auto flex-1">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredMessages.length > 0 ? (
                    <ul className="divide-y">
                      {filteredMessages.map(message => (
                        <li 
                          key={message.id} 
                          ref={message.id === initialMessageId ? highlightedMessageRef : null}
                          onClick={() => {
                            setViewingMessage(message);
                            if (!message.is_read) {
                              markAsRead(message.id);
                            }
                          }}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            message.id === initialMessageId ? 'bg-primary-50' : 
                            !message.is_read ? 'bg-accent-blue/5' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-primary-100 text-primary`}>
                              {message.sender_first_name?.charAt(0)}{message.sender_last_name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <span className={`text-sm font-medium truncate ${!message.is_read ? 'text-primary-800 font-semibold' : ''}`}>
                                  {message.sender_first_name} {message.sender_last_name}
                                </span>
                                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                  {new Date(message.sent_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className={`text-sm font-medium truncate ${!message.is_read ? 'text-primary-800' : ''}`}>
                                {message.subject}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {message.content}
                              </p>
                              
                              {/* Tags for message status */}
                              {!message.is_read && (
                                <div className="mt-2">
                                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                                    new
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              {message.is_read ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsUnread(message.id);
                                  }}
                                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-full transition-colors"
                                  title="Mark as unread"
                                >
                                  <FaEnvelope size={14} />
                                </button>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(message.id);
                                  }}
                                  className="p-2 text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10 rounded-full transition-colors"
                                  title="Mark as read"
                                >
                                  <FaEnvelopeOpen size={14} />
                                </button>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMessage(message.id);
                                }}
                                className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-full transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={14} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleImportant(message.id, !!message.is_important);
                                }}
                                className={`p-2 rounded-full transition-colors ${
                                  message.is_important 
                                    ? 'text-accent-orange hover:text-accent-orange/80 hover:bg-accent-orange/10' 
                                    : 'text-gray-400 hover:text-accent-orange hover:bg-accent-orange/10'
                                }`}
                                title={message.is_important ? "Remove importance" : "Mark as important"}
                              >
                                <FaStar size={14} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <FaEnvelope className="text-4xl mb-4 text-gray-300" />
                      <p className="text-lg">No messages found</p>
                      {searchTerm && (
                        <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
                      )}
                      {activeFolder !== 'inbox' && (
                        <button
                          onClick={() => setActiveFolder('inbox')}
                          className="mt-4 text-primary hover:text-primary-800"
                        >
                          View all messages
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

export default MessageModal;