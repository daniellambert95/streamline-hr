import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import danielImage from "../assets/daniel.png";

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personal"); // Manage tabs
  const [user, setUser] = useState<any>(null);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      fetch("http://localhost:3000/api/users/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((error) => {
          console.error(error);
          setIsAuthenticated(false);
          navigate("/login");
        });
    }
  }, [navigate, setIsAuthenticated]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      {/* User Header */}
      <div className="flex items-center space-x-4">
        <img 
          src={danielImage || "https://via.placeholder.com/80"}
          alt="User Avatar"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-gray-600">Founder at Streamline HR</p>
          {/* <p className="text-gray-600">{user.job_title} at {user.company_name}</p> */}
          {/* <p className="text-gray-500">{user.email}</p> */}
          <p className="text-gray-500">danjlambert95@gmail.com</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mt-6">
        <nav className="flex space-x-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "personal" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "id" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("id")}
          >
            ID Documents
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "emergency" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("emergency")}
          >
            Emergency Contacts
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "personal" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium">{user.gender || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-medium">{user.date_of_birth || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Nationality</p>
                <p className="font-medium">{user.nationality || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Job Level</p>
                <p className="font-medium">{user.job_level || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Salary</p>
                <p className="font-medium">${user.salary || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Holiday Time</p>
                <p className="font-medium">{user.holiday_time || "N/A"} days</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "id" && (
          <div>
            <p className="text-gray-500">Passport / ID Document</p>
            {user.id_document ? (
              <a
                href={user.id_document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                View ID Document
              </a>
            ) : (
              <p className="font-medium">No ID uploaded</p>
            )}
          </div>
        )}

        {activeTab === "emergency" && (
          <div>
            <p className="text-gray-500">Emergency Contact</p>
            {user.emergency_contact ? (
              <p className="font-medium">{user.emergency_contact}</p>
            ) : (
              <p className="font-medium">No emergency contact set</p>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6 text-right">
        <button className="px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;