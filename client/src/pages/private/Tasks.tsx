import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import TaskList from '../../domains/dashboard/components/TaskList';
import { taskService } from '../../domains/users/services/tasks';
import { toast } from 'react-hot-toast';

const Tasks: React.FC = () => {
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      await taskService.createTaskList({ name: newListName.trim() });
      setNewListName('');
      setIsNewListModalOpen(false);
      // Refresh task lists through the TaskList component
    } catch (error) {
      toast.error('Failed to create task list');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
        <button
          onClick={() => setIsNewListModalOpen(true)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-2"
        >
          <FaPlus size={14} />
          New Task List
        </button>
      </div>

      <TaskList onTaskClick={() => {}} onExpandClick={() => {}} />

      {/* New Task List Modal */}
      {isNewListModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Task List</h2>
            <form onSubmit={handleCreateList}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name..."
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewListModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks; 