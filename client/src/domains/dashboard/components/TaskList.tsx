import React, { useState, useEffect } from 'react';
import { FaCheck, FaPlus, FaTrash, FaCalendar, FaFlag, FaExpand, FaSort } from 'react-icons/fa';
import { Task, TaskList as TaskListType } from '../../users/types/task.types';
import { taskService } from '../../users/services/tasks';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TaskListProps {
  onTaskClick?: (taskId: number) => void;
  onExpandClick?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskClick, onExpandClick }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTaskList, setActiveTaskList] = useState<number | null>(null);
  const [selectedTaskList, setSelectedTaskList] = useState<string>('Work Tasks');
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

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !activeTaskList) return;

    try {
      const { data: newTaskData } = await taskService.createTask({
        description: newTask,
        task_list_id: activeTaskList,
        status: 'pending',
      });
      
      setTasks([...tasks, newTaskData]);
      setNewTask('');
      toast.success('Task added');
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (taskId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Failed to toggle task:', error);
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
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
              <span className="text-white text-sm">📋</span>
            </div>
            Quick Tasks
          </h2>
          <button
            onClick={onExpandClick}
            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-300"
            title="Expand Task View"
          >
            <FaExpand size={16} />
          </button>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <select
              value={selectedTaskList}
              onChange={(e) => {
                const selected = taskLists.find(list => list.name === e.target.value);
                if (selected) {
                  setActiveTaskList(selected.id);
                  setSelectedTaskList(selected.name);
                }
              }}
              className="appearance-none w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            >
              {taskLists.map(list => (
                <option key={list.id} value={list.name}>
                  {list.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            >
              <option value="default">Default</option>
              <option value="due-date-asc">Due Date</option>
              <option value="priority-high">Priority</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <FaSort className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none shadow-sm transition-all duration-300"
          disabled={!activeTaskList}
        />
        <button
          type="submit"
          className={`px-4 py-3 rounded-xl transition-all duration-300 shadow-sm ${
            !activeTaskList 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg transform hover:scale-105'
          }`}
          disabled={!activeTaskList}
        >
          <FaPlus />
        </button>
      </form>

      {/* Tasks List */}
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-gray-500 text-sm">
                  {!activeTaskList 
                    ? 'Select a task list to get started'
                    : 'No tasks yet. Add your first one!'}
                </p>
              </div>
            ) : (
              <>
                {/* Only show the first 4 tasks */}
                {sortedTasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    className={`group relative bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-white/80 ${
                      task.status === 'completed' ? 'opacity-75' : ''
                    }`}
                    onClick={() => onTaskClick?.(task.id)}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening modal when toggling status
                          toggleTask(task.id, task.status);
                        }}
                        className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                          task.status === 'completed' 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-500 transform scale-110' 
                            : 'border-gray-300 hover:border-indigo-400'
                        }`}
                      >
                        {task.status === 'completed' && <FaCheck className="text-white text-xs" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-gray-800 ${
                          task.status === 'completed' ? 'line-through text-gray-500' : ''
                        }`}>
                          {task.description}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
                          <DatePicker
                            selected={task.due_date ? new Date(task.due_date) : null}
                            onChange={(date) => updateTaskDueDate(task.id, date)}
                            dateFormat="MMM d"
                            className={`text-xs bg-transparent border-none focus:outline-none cursor-pointer ${
                              isPastDue(task.due_date as string | null) ? 'text-red-500' : 'text-gray-500'
                            }`}
                            customInput={
                              <button className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
                                isPastDue(task.due_date as string | null) 
                                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                                  : 'text-gray-500 hover:bg-gray-100'
                              }`}>
                                <FaCalendar className={isPastDue(task.due_date as string | null) ? 'text-red-500' : 'text-gray-400'} />
                                {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Set due date'}
                              </button>
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <PriorityDisplay task={task} />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent opening modal when deleting
                            deleteTask(task.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300 p-1 rounded"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show "View more" button if there are more than 4 tasks */}
                {sortedTasks.length > 4 && (
                  <button
                    onClick={onExpandClick}
                    className="w-full py-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-300 border border-indigo-200"
                  >
                    View {sortedTasks.length - 4} more tasks
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;