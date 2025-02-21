import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { employeeService } from '../../services/api/endpoints/employees';
import { Employee } from '../../types/employee';
import AddEmployeeForm from '../../components/employees/AddEmployeeForm';

const Employees: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees';
      console.error('Error fetching employees:', error);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    await fetchEmployees(); // Refresh the list after adding
    setIsModalOpen(false);
    toast.success('Employee added successfully');
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
                    <td className="py-3 px-4">{employee.job_title || ""}</td>
                    <td className="py-3 px-4">{employee.team_name || ""}</td>
                    <td className="py-3 px-4">{employee.manager_name || ""}</td>
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
      <AddEmployeeForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleAddEmployee} 
      />
    </div>
  );
};

export default Employees;