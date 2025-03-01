import React, { useState, useEffect } from 'react';
import { FaCheck, FaPlus, FaTrash, FaCalendar, FaFlag, FaExpand, FaSpinner } from 'react-icons/fa';
import { Task, TaskList as TaskListType } from '../../users/types/task.types';
import { taskService } from '../../users/services/tasks';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TaskListModal from './TaskListModal';

interface TaskListProps {
  showFullFeatures?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ showFullFeatures = false }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTaskList, setActiveTaskList] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskList, setSelectedTaskList] = useState<string>('Work Tasks');

  // Helper function to check if a date is in the past
  const isPastDue = (dateString: string | null): boolean => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    return dueDate < today;
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await taskService.getAllTasks();
      setTasks(data.tasks);
      
      // Sort task lists by creation order (oldest first)
      const sortedLists = [...data.taskLists].sort((a, b) => a.id - b.id);
      setTaskLists(sortedLists);
      
      // Always set the first list as active if there are any lists
      if (sortedLists.length > 0) {
        setActiveTaskList(sortedLists[0].id);
        setSelectedTaskList(sortedLists[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add missing functions
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !activeTaskList) return;
    
    try {
      const response = await taskService.createTask({
        description: newTask,
        task_list_id: activeTaskList,
        status: 'pending',
        priority: 4, // Default to Normal priority
        due_date: undefined
      });
      
      // The API is returning the task directly, not wrapped in data.task
      const newTaskData = response.data || response;
      
      setTasks([...tasks, newTaskData]);
      setNewTask('');
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (taskId: number, currentStatus: string) => {
    // Cycle through statuses: pending -> in_progress -> completed -> pending
    let newStatus: 'pending' | 'in_progress' | 'completed';
    
    switch (currentStatus) {
      case 'pending':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'pending';
    }
    
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task status');
    }
  };

  const updateTaskDescription = async (taskId: number, description: string) => {
    if (!description.trim()) return;
    
    try {
      await taskService.updateTask(taskId, { description });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, description } : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const updateTaskDueDate = async (taskId: number, date: Date | null) => {
    try {
      const due_date = date ? date.toISOString().split('T')[0] : null;
      await taskService.updateTask(taskId, { due_date });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, due_date: due_date as string | undefined } : task
      ));
    } catch (error) {
      console.error('Failed to update due date:', error);
      toast.error('Failed to update due date');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Add missing PrioritySelector component
  const PrioritySelector = ({ task }: { task: Task }) => {
    const getPriorityColor = (priority: number) => {
      switch (priority) {
        case 1: return 'text-red-500'; // Urgent
        case 2: return 'text-orange-500'; // High
        case 3: return 'text-blue-500'; // Medium
        case 4: return 'text-green-500'; // Normal
        case 5: return 'text-gray-500'; // Low
        default: return 'text-blue-500';
      }
    };

    const getPriorityLabel = (priority: number) => {
      switch (priority) {
        case 1: return 'Urgent';
        case 2: return 'High';
        case 3: return 'Medium';
        case 4: return 'Normal';
        case 5: return 'Low';
        default: return 'Normal';
      }
    };

    const updateTaskPriority = async (taskId: number, priority: number) => {
      try {
        await taskService.updateTask(taskId, { priority });
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, priority } : t
        ));
      } catch (error) {
        console.error('Failed to update priority:', error);
        toast.error('Failed to update priority');
      }
    };

    return (
      <div className="relative inline-block">
        <button 
          className={`flex items-center gap-1 text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}
          onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}
        >
          <FaFlag /> 
        </button>
        <div className="absolute z-10 mt-1 w-32 bg-white border rounded shadow-lg hidden">
          <div 
            className="px-3 py-2 hover:bg-gray-100 text-red-500 cursor-pointer flex items-center gap-2"
            onClick={() => updateTaskPriority(task.id, 1)}
          >
            <FaFlag /> Urgent
          </div>
          <div 
            className="px-3 py-2 hover:bg-gray-100 text-orange-500 cursor-pointer flex items-center gap-2"
            onClick={() => updateTaskPriority(task.id, 2)}
          >
            <FaFlag /> High
          </div>
          <div 
            className="px-3 py-2 hover:bg-gray-100 text-blue-500 cursor-pointer flex items-center gap-2"
            onClick={() => updateTaskPriority(task.id, 3)}
          >
            <FaFlag /> Medium
          </div>
          <div 
            className="px-3 py-2 hover:bg-gray-100 text-green-500 cursor-pointer flex items-center gap-2"
            onClick={() => updateTaskPriority(task.id, 4)}
          >
            <FaFlag /> Normal
          </div>
          <div 
            className="px-3 py-2 hover:bg-gray-100 text-gray-500 cursor-pointer flex items-center gap-2"
            onClick={() => updateTaskPriority(task.id, 5)}
          >
            <FaFlag /> Low
          </div>
        </div>
      </div>
    );
  };

  // Filter tasks based on active list
  const filteredTasks = tasks.filter(task => task.task_list_id === activeTaskList);

  // Add these helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return null;
      case 'in_progress':
        return <FaSpinner className="text-blue-500 text-xs" />;
      case 'completed':
        return <FaCheck className="text-white text-xs" />;
      default:
        return null;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-gray-300';
      case 'in_progress':
        return 'bg-blue-100 border-blue-500';
      case 'completed':
        return 'bg-indigo-500 border-indigo-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div className="relative">
            <select
              value={selectedTaskList}
              onChange={(e) => {
                const selected = taskLists.find(list => list.name === e.target.value);
                if (selected) {
                  setActiveTaskList(selected.id);
                  setSelectedTaskList(selected.name);
                }
              }}
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {taskLists.map(list => (
                <option key={list.id} value={list.name}>
                  {list.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="text-indigo-600 hover:text-indigo-800"
            title="Expand Task View"
          >
            <FaExpand size={18} />
          </button>
        </div>
      </div>

      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          disabled={!activeTaskList}
        />
        <button
          type="submit"
          className={`p-2 rounded-lg ${
            !activeTaskList 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
          disabled={!activeTaskList}
        >
          <FaPlus />
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 p-4">
              {!activeTaskList 
                ? 'Select a task list to get started'
                : 'No tasks yet. Add your first one!'}
            </p>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center p-4 rounded-lg border ${
                  task.status === 'completed' ? 'bg-gray-50' : 
                  task.status === 'in_progress' ? 'bg-blue-50' : 'bg-white'
                } hover:shadow-md transition-shadow`}
              >
                <button
                  onClick={() => toggleTask(task.id, task.status)}
                  className={`w-5 h-5 rounded border mr-4 flex items-center justify-center ${
                    getStatusBgColor(task.status)
                  }`}
                  title={`Status: ${task.status.replace('_', ' ')}`}
                >
                  {getStatusIcon(task.status)}
                </button>

                <div className="flex-grow">
                  {editingTask === task.id ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.querySelector('input');
                        if (input) {
                          updateTaskDescription(task.id, input.value);
                        }
                      }}
                      className="flex-grow"
                    >
                      <input
                        type="text"
                        defaultValue={task.description}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                        onBlur={(e) => updateTaskDescription(task.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setEditingTask(null);
                          }
                        }}
                      />
                    </form>
                  ) : (
                    <span 
                      className={task.status === 'completed' ? 'line-through text-gray-500' : ''}
                      onDoubleClick={() => setEditingTask(task.id)}
                    >
                      {task.description}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1">
                    <DatePicker
                      selected={task.due_date ? new Date(task.due_date) : null}
                      onChange={(date) => updateTaskDueDate(task.id, date)}
                      dateFormat="MMM d, yyyy"
                      className={`text-xs border rounded px-2 py-1 ${isPastDue(task.due_date as string | null) ? 'text-red-500' : 'text-gray-500'}`}
                      customInput={
                        <button className={`flex items-center gap-1 text-xs ${isPastDue(task.due_date as string | null) ? 'text-red-500' : 'text-gray-500'}`}>
                          <FaCalendar className={isPastDue(task.due_date as string | null) ? 'text-red-500' : ''} />
                          {task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : 'Set due date'}
                        </button>
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PrioritySelector task={task} />
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Task List Modal */}
      {isTaskModalOpen && (
        <TaskListModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskList;