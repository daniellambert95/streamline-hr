import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import danielImage from "../assets/daniel.png";
import EditProfileModal from "../components/EditProfileModal";

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personal"); // Manage tabs
  const [user, setUser] = useState<any>(null);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      fetch("http://localhost:3000/api/users/user-profile", {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          console.log('Received profile data:', data);
          setUser(data);
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
          setIsAuthenticated(false);
          navigate("/login");
        });
    }
  }, [navigate, setIsAuthenticated]);

  const handleProfileUpdate = (updatedData: any) => {
    setUser(updatedData);
  };

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
          <p className="text-gray-600">{user.job_title} at {user.company_name}</p>
          <p className="text-gray-500">{user.email}</p>
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
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-600">Job Title</h3>
              <p className="font-medium">{user.job_title || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Job Level</h3>
              <p className="font-medium">{user.job_level || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Team</h3>
              <p className="font-medium">{user.team_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Manager</h3>
              <p className="font-medium">{user.manager_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Company</h3>
              <p className="font-medium">{user.company_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Industry</h3>
              <p className="font-medium">{user.industry || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Salary</h3>
              <p className="font-medium">{user.salary ? `$${user.salary}` : 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Holiday Time</h3>
              <p className="font-medium">{user.holiday_time ? `${user.holiday_time} days` : 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Mobile Number</h3>
              <p className="font-medium">{user.mobile_number || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-gray-600">Starting Date</h3>
              <p className="font-medium">
                {user.starting_date ? new Date(user.starting_date).toLocaleDateString() : 'N/A'}
              </p>
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
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
        >
          Edit Profile
        </button>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={user}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default UserProfile;