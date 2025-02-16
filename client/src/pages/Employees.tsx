import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEmployeeModal from '../components/AddEmployeeModal';

const Employees: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  // Dummy data for testing
  const [employees, setEmployees] = useState([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      job_title: "Software Engineer",
      team_name: "Development",
      manager_name: "Sarah Williams",
      starting_date: "2023-05-15",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "janesmith@example.com",
      job_title: "Product Manager",
      team_name: "Product",
      manager_name: "Mark Johnson",
      starting_date: "2022-08-22",
    },
    {
      id: 3,
      first_name: "Emily",
      last_name: "Johnson",
      email: "emilyjohnson@example.com",
      job_title: "HR Specialist",
      team_name: "Human Resources",
      manager_name: "Lisa Brown",
      starting_date: "2021-10-05",
    },
    {
      id: 4,
      first_name: "Michael",
      last_name: "Brown",
      email: "michaelbrown@example.com",
      job_title: "Sales Executive",
      team_name: "Sales",
      manager_name: "David Lee",
      starting_date: "2020-06-18",
    },
  ]);

  /*
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:3000/api/employees", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [navigate]);
  */

  // Function to handle adding a new employee (dummy implementation)
  const handleAddEmployee = (newEmployee: any) => {
    setEmployees([...employees, { id: employees.length + 1, ...newEmployee }]);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Employees</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
          >
            + Add Employee
          </button>
        </div>

        {/* Employees Table */}
        {employees.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Job Title</th>
                  <th className="py-3 px-4 text-left">Team</th>
                  <th className="py-3 px-4 text-left">Manager</th>
                  <th className="py-3 px-4 text-left">Start Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="py-3 px-4">
                      {employee.first_name} {employee.last_name}
                    </td>
                    <td className="py-3 px-4">{employee.email}</td>
                    <td className="py-3 px-4">{employee.job_title || "N/A"}</td>
                    <td className="py-3 px-4">{employee.team_name || "N/A"}</td>
                    <td className="py-3 px-4">{employee.manager_name || "N/A"}</td>
                    <td className="py-3 px-4">
                      {new Date(employee.starting_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 mr-2"
                        onClick={() => navigate(`/employee/${employee.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    
      {/* Add Employee Modal */}
      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddEmployee} />
    </div>
  );
};

export default Employees;