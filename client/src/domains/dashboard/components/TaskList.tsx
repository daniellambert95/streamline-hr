import React, { useState, useEffect } from 'react';
import { FaCheck, FaPlus, FaTrash, FaCalendar, FaFlag, FaExpand, FaSort } from 'react-icons/fa';
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
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');

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
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
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

  // Display priority color but don't allow editing
  const PriorityDisplay = ({ task }: { task: Task }) => {
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

    return (
      <div className={`flex items-center gap-1 text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}>
        <FaFlag />
      </div>
    );
  };

  // Open task modal with specific task
  const openTaskWithId = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  // Add a function to sort tasks
  const getSortedTasks = () => {
    // First filter by active list
    let result = tasks.filter(task => task.task_list_id === activeTaskList);
    
    // Then sort based on selected order
    switch (sortOrder) {
      case 'due-date-asc':
        return result.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
      case 'priority-high':
        return result.sort((a, b) => a.priority - b.priority); // Lower number = higher priority
      default:
        return result; // Default order (by creation date/ID)
    }
  };

  // Replace filteredTasks with sortedTasks
  const sortedTasks = getSortedTasks();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
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
                className="appearance-none bg-white border rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none bg-white border rounded-lg px-3 py-1.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="default">Default Order</option>
                <option value="due-date-asc">Due Date</option>
                <option value="priority-high">Priority</option>

              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <FaSort className="h-3 w-3 text-gray-500" />
              </div>
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
        <div className="space-y-2">
          {sortedTasks.length === 0 ? (
            <p className="text-center text-gray-500 p-4">
              {!activeTaskList 
                ? 'Select a task list to get started'
                : 'No tasks yet. Add your first one!'}
            </p>
          ) : (
            <>
              {/* Only show the first 4 tasks */}
              {sortedTasks.slice(0, 4).map(task => (
                <div
                  key={task.id}
                  className={`flex items-center p-3 rounded-lg border ${
                    task.status === 'completed' ? 'bg-gray-50' : 'bg-white'
                  } hover:shadow-md transition-shadow cursor-pointer mb-2`}
                  onClick={() => openTaskWithId(task.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening modal when toggling status
                      toggleTask(task.id, task.status);
                    }}
                    className={`w-5 h-5 rounded border mr-4 flex items-center justify-center ${
                      task.status === 'completed' ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'
                    }`}
                  >
                    {task.status === 'completed' && <FaCheck className="text-white text-xs" />}
                  </button>

                  <div className="flex-grow">
                    {editingTask === task.id ? (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Prevent opening modal when submitting form
                          const input = e.currentTarget.querySelector('input');
                          if (input) {
                            updateTaskDescription(task.id, input.value);
                          }
                        }}
                        className="flex-grow"
                        onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking form
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
                        onDoubleClick={(e) => {
                          e.stopPropagation(); // Prevent opening modal when double-clicking
                          setEditingTask(task.id);
                        }}
                      >
                        {task.description}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
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
                    <PriorityDisplay task={task} />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening modal when deleting
                        deleteTask(task.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Show "View more" button if there are more than 4 tasks */}
              {sortedTasks.length > 4 && (
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-dashed rounded-lg flex items-center justify-center gap-2"
                >
                  <span>View {sortedTasks.length - 4} more tasks</span>
                  <FaExpand size={14} />
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Task List Modal */}
      {isTaskModalOpen && (
        <TaskListModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTaskId(null);
          }}
          selectedTaskId={selectedTaskId}
        />
      )}
    </div>
  );
};

export default TaskList;