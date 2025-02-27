import React, { useState } from 'react';
import { FaCheck, FaPlus } from 'react-icons/fa';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Review candidate applications', completed: false, priority: 'high' },
    { id: 2, title: 'Schedule team meeting', completed: true, priority: 'medium' },
    { id: 3, title: 'Complete performance reviews', completed: false, priority: 'high' },
    { id: 4, title: 'Update job descriptions', completed: false, priority: 'low' },
  ]);

  const [newTask, setNewTask] = useState('');

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    setTasks([...tasks, {
      id: Date.now(),
      title: newTask,
      completed: false,
      priority: 'medium'
    }]);
    setNewTask('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      
      <form onSubmit={addTask} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600"
        >
          <FaPlus />
        </button>
      </form>

      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center p-3 rounded-lg border ${
              task.completed ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'
              }`}
            >
              {task.completed && <FaCheck className="text-white text-xs" />}
            </button>
            <span className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList; 