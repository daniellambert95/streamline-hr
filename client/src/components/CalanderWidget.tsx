import React from "react";
import { FaGoogle, FaVideo } from "react-icons/fa";

const CalendarWidget: React.FC = () => {
  const events = [
    {
      time: "12:00",
      title: "CEO",
      type: "One-to-one",
      icon: "google-meet", // Placeholder for Google Meet icon
      color: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      time: "13:40",
      title: "Creative director",
      type: "Interview",
      icon: "zoom", // Placeholder for Zoom icon
      color: "bg-pink-100",
      textColor: "text-pink-600",
    },
    {
      time: "15:00",
      title: "Gregory Will",
      type: "One-to-one",
      icon: "google-meet", // Placeholder for Google Meet icon
      color: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      time: "17:00",
      title: "Alex Sander",
      type: "Interview",
      icon: "google-meet", // Placeholder for Google Meet icon
      color: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Today, October 12</h2>
        <div className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </div>
      </div>

      {/* Events */}
      <div className="space-y-4 flex-grow overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className={`flex items-center p-4 rounded-lg ${event.color}`}
          >
            {/* Time */}
            <div className="text-gray-600 font-semibold mr-4">{event.time}</div>

            {/* Event Details */}
            <div className="flex-grow">
              <p className={`font-semibold ${event.textColor}`}>{event.title}</p>
              <p className="text-gray-600 text-sm">{event.type}</p>
            </div>

            {/* Icon */}
            <div>
              {event.icon === "google-meet" ? (
                <FaGoogle className="text-purple-600 h-6 w-6" />
              ) : event.icon === "zoom" ? (
                <FaVideo className="text-blue-600 h-6 w-6" />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;