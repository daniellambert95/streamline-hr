import React, { useState } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! Welcome to StreamlineHR. Our full platform is currently in development. Would you like to be notified when we launch?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [emailSignup, setEmailSignup] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        isBot: false,
        timestamp: new Date()
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thanks for your interest! Our full chatbot and StreamlineHR app isn't ready yet, but we're working hard to launch soon. If you'd like to be notified when we go live, please add your email address below:",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setShowEmailForm(true);
      }, 1000);
    }
  };

  const handleEmailSubmit = () => {
    if (emailSignup.trim() && emailSignup.includes('@')) {
      // Here you would typically send the email to your backend
      console.log('Email submitted:', emailSignup);
      
      const confirmationMessage = {
        id: messages.length + 1,
        text: `Thank you! We've added ${emailSignup} to our launch notification list. You'll be among the first to know when StreamlineHR is ready!`,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      setEmailSignup('');
      setShowEmailForm(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailSubmit();
    }
  };

  return (
    <>
      {/* Chat Button - Right Bottom */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChat}
          className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl text-primary transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2"
        >
          {isOpen ? (
            /* Close Icon */
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Chat Icon */
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-96">
          <div className="bg-neutral-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-purple-800 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Aimee</h3>
                  <p className="text-xs text-white/80">Artificial Chatbot</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gradient-to-r from-primary to-purple-800 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {/* Email Signup Form */}
              {showEmailForm && (
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <p className="text-sm text-gray-700 font-medium">Get Launch Notifications:</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailSignup}
                      onChange={(e) => setEmailSignup(e.target.value)}
                      onKeyPress={handleEmailKeyPress}
                      placeholder="your@email.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                    <button
                      onClick={handleEmailSubmit}
                      className="bg-neutral-white border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition-all duration-300 transform hover:scale-[1.02] text-sm font-medium"
                    >
                      Notify Me
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="bg-neutral-white border-2 border-primary text-primary px-4 py-2 rounded-xl hover:bg-primary/5 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 