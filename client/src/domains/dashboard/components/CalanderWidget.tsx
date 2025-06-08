import React from "react";
import { FaGoogle, FaVideo, FaCalendarAlt } from "react-icons/fa";

const CalendarWidget: React.FC = () => {
  const events = [
    {
      time: "12:00",
      title: "CEO",
      type: "One-to-one",
      icon: "google-meet",
      color: "bg-gradient-to-r from-purple-100 to-purple-200",
      textColor: "text-purple-700",
      bgPattern: "bg-purple-50",
    },
    {
      time: "13:40",
      title: "Creative director",
      type: "Interview",
      icon: "zoom",
      color: "bg-gradient-to-r from-pink-100 to-pink-200",
      textColor: "text-pink-700",
      bgPattern: "bg-pink-50",
    },
    {
      time: "15:00",
      title: "Gregory Will",
      type: "One-to-one",
      icon: "google-meet",
      color: "bg-gradient-to-r from-green-100 to-green-200",
      textColor: "text-green-700",
      bgPattern: "bg-green-50",
    },
    {
      time: "17:00",
      title: "Alex Sander",
      type: "Interview",
      icon: "google-meet",
      color: "bg-gradient-to-r from-indigo-100 to-indigo-200",
      textColor: "text-indigo-700",
      bgPattern: "bg-indigo-50",
    },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <FaCalendarAlt className="text-white text-sm" />
          </div>
          Today, October 12
        </h2>
        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 9h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* Events */}
      <div className="space-y-4 flex-grow overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className={`group relative p-4 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer ${event.color} border border-white/20 backdrop-blur-sm hover:scale-105`}
          >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-50"></div>
            
            <div className="relative z-10 flex items-center">
              {/* Time Badge */}
              <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-white/30 mr-4">
                <span className="text-gray-800 font-bold text-sm">{event.time}</span>
              </div>

              {/* Event Details */}
              <div className="flex-grow">
                <h3 className={`font-bold text-lg ${event.textColor} mb-1`}>
                  {event.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${event.bgPattern} ${event.textColor} border border-current/20`}>
                    {event.type}
                  </span>
                </div>
              </div>

              {/* Meeting Icon */}
              <div className="ml-4">
                <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  {event.icon === "google-meet" ? (
                    <FaGoogle className="text-purple-600 h-5 w-5" />
                  ) : event.icon === "zoom" ? (
                    <FaVideo className="text-blue-600 h-5 w-5" />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full py-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-300 border border-indigo-200 flex items-center justify-center gap-2">
          <FaCalendarAlt className="text-sm" />
          View Full Calendar
        </button>
      </div>
    </div>
  );
};

export default CalendarWidget;