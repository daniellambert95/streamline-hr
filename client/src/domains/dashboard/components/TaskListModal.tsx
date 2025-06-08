import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaCheck, FaTrash, FaCalendar, FaFlag, FaEdit, FaSave, FaTasks, FaSpinner, FaSort } from 'react-icons/fa';
import { Task, TaskList as TaskListType } from '../../users/types/task.types';
import { taskService } from '../../users/services/tasks';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useSidebar } from '../../../core/context/SidebarContext';

interface TaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTaskId?: number | null;
}

const TaskListModal: React.FC<TaskListModalProps> = ({ isOpen, onClose, selectedTaskId = null }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | null>(null);
  const [newTaskPriority, setNewTaskPriority] = useState(4); // Default to Normal priority
  const [newListName, setNewListName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTaskList, setActiveTaskList] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [taskViewFilter, setTaskViewFilter] = useState('all'); // 'all', 'pending', 'completed', 'overdue'
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [newTaskStatus, setNewTaskStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [sortOrder, setSortOrder] = useState<string>('default');
  const { isSidebarCollapsed } = useSidebar();

  useEffect(() => {
    if (isOpen) {
      fetchTasksAndLists();
    }
  }, [isOpen]);

  useEffect(() => {
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    setPendingTasksCount(pendingTasks.length);
  }, [tasks]);

  useEffect(() => {
    if (selectedTaskId && isOpen) {
      // Find the task in our tasks array
      const task = tasks.find(t => t.id === selectedTaskId);
      if (task) {
        // Set the active task list to match the selected task
        setActiveTaskList(task.task_list_id);
        
        // Find the list name for the dropdown
        const list = taskLists.find(l => l.id === task.task_list_id);
        if (list) {
          // Update any state that tracks the selected list name if you have it
          // setSelectedTaskList(list.name);
        }
        
        // Wait for the DOM to update, then scroll to the element
        setTimeout(() => {
          const element = document.getElementById(`task-${selectedTaskId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('border-indigo-500', 'border-2'); // Only add border, no background change
            
            // Remove highlight after a few seconds
            setTimeout(() => {
              element.classList.remove('border-indigo-500', 'border-2');
            }, 3000);
          }
        }, 100);
      }
    }
  }, [selectedTaskId, isOpen, tasks, taskLists]);

  const fetchTasksAndLists = async () => {
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
      }

      // Calculate pending tasks count
      const pendingTasks = data.tasks.filter((task: Task) => task.status === 'pending');
      setPendingTasksCount(pendingTasks.length);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a date is in the past
  const isPastDue = (dateString: string | null): boolean => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    return dueDate < today;
  };

  // Add a function to sort tasks
  const getSortedTasks = () => {
    // First filter based on active list and view filter
    let result = tasks.filter(task => {
      const listMatch = task.task_list_id === activeTaskList;
      
      if (!listMatch) return false;
      
      switch (taskViewFilter) {
        case 'pending':
          return task.status === 'pending';
        case 'in_progress':
          return task.status === 'in_progress';
        case 'completed':
          return task.status === 'completed';
        case 'overdue':
          return (task.status === 'pending' || task.status === 'in_progress') && 
                 isPastDue(task.due_date as string | null);
        default:
          return true;
      }
    });
    
    // Then sort based on selected order
    switch (sortOrder) {
      case 'due-date-asc':
        return result.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
      case 'due-date-desc':
        return result.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
        });
      case 'priority-high':
        return result.sort((a, b) => a.priority - b.priority); // Lower number = higher priority
      case 'priority-low':
        return result.sort((a, b) => b.priority - a.priority); // Higher number = lower priority
      default:
        return result; // Default order (by creation date/ID)
    }
  };

  // Replace filteredTasks with sortedTasks
  const sortedTasks = getSortedTasks();

  // Add missing functions
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

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !activeTaskList) return;
    
    try {
      const response = await taskService.createTask({
        description: newTask,
        task_list_id: activeTaskList,
        status: newTaskStatus,
        priority: newTaskPriority,
        due_date: newTaskDueDate ? newTaskDueDate.toISOString().split('T')[0] : undefined
      });
      
      const newTaskData = response.data || response;
      
      setTasks([...tasks, newTaskData]);
      setNewTask('');
      setNewTaskDueDate(null);
      setNewTaskPriority(4); // Reset to default
      setNewTaskStatus('pending'); // Reset to default
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
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      
      // Update pending count immediately
      const pendingCount = updatedTasks.filter(task => task.status === 'pending').length;
      setPendingTasksCount(pendingCount);
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task status');
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

  const updateTaskPriority = async (taskId: number, priority: number) => {
    try {
      await taskService.updateTask(taskId, { priority });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, priority } : task
      ));
    } catch (error) {
      console.error('Failed to update priority:', error);
      toast.error('Failed to update priority');
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

  const startEditingTask = (task: Task) => {
    setEditingTask(task.id);
    setEditingTaskText(task.description);
  };

  const saveTaskEdit = async (taskId: number) => {
    if (!editingTaskText.trim()) return;
    
    try {
      await taskService.updateTask(taskId, { description: editingTaskText });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, description: editingTaskText } : task
      ));
      setEditingTask(null);
      setEditingTaskText('');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const createTaskList = async () => {
    if (!newListName.trim()) return;
    
    try {
      const { data } = await taskService.createTaskList({ name: newListName });
      setTaskLists([...taskLists, data.taskList]);
      setNewListName('');
      setIsCreatingList(false);
      setActiveTaskList(data.taskList.id);
      toast.success('Task list created');
    } catch (error) {
      console.error('Failed to create task list:', error);
      toast.error('Failed to create task list');
    }
  };

  const deleteTaskList = async (listId: number) => {
    if (!confirm('Are you sure you want to delete this list and all its tasks?')) return;
    
    try {
      await taskService.deleteTaskList(listId);
      setTaskLists(taskLists.filter(list => list.id !== listId));
      
      // Remove tasks associated with this list
      setTasks(tasks.filter(task => task.task_list_id !== listId));
      
      // If the active list was deleted, set the first available list as active
      if (activeTaskList === listId) {
        const remainingLists = taskLists.filter(list => list.id !== listId);
        setActiveTaskList(remainingLists.length > 0 ? remainingLists[0].id : null);
      }
      
      toast.success('Task list deleted');
    } catch (error) {
      console.error('Failed to delete task list:', error);
      toast.error('Failed to delete task list');
    }
  };

  // Add a function to get status icon
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

  // Add a function to get status background color
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

  const updateTaskStatus = (taskId: number, newStatus: 'pending' | 'in_progress' | 'completed') => {
    try {
      taskService.updateTask(taskId, { status: newStatus });
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);
      
      // Update pending count immediately
      const pendingCount = updatedTasks.filter(task => task.status === 'pending').length;
      setPendingTasksCount(pendingCount);
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50"
      style={{ 
        margin: 0,
        display: 'grid',
        placeItems: 'center',
        paddingLeft: isSidebarCollapsed ? '5rem' : '17rem', // Responsive to sidebar state
        paddingRight: '1rem',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
      onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-hidden"
        style={{
          maxWidth: isSidebarCollapsed ? 'calc(100vw - 6rem)' : 'calc(100vw - 18rem)' // Responsive to sidebar state
        }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <FaTasks className="text-indigo-600 mr-2 text-xl" />
            <h2 className="text-xl font-semibold">Task Manager</h2>
            {pendingTasksCount > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingTasksCount} pending
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-12 h-[calc(90vh-4rem)] overflow-hidden">
          {/* Sidebar */}
          <div className="col-span-3 border-r p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">My Lists</h3>
              <button
                onClick={() => setIsCreatingList(!isCreatingList)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {isCreatingList ? 'Cancel' : <FaPlus />}
              </button>
            </div>
            
            {isCreatingList ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  createTaskList();
                }}
                className="mb-4"
              >
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name..."
                  className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    disabled={!newListName.trim()}
                  >
                    Create
                  </button>
                </div>
              </form>
            ) : null}
            
            <ul className="space-y-1">
              {taskLists.map(list => (
                <li key={list.id} className="flex justify-between items-center">
                  <button
                    onClick={() => setActiveTaskList(list.id)}
                    className={`text-left py-2 px-3 rounded-lg flex-grow text-sm ${
                      activeTaskList === list.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    {list.name}
                  </button>
                  <button
                    onClick={() => deleteTaskList(list.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete List"
                  >
                    <FaTrash size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tasks Content */}
          <div className="col-span-9 overflow-hidden flex flex-col h-full p-4">
            {/* Task filters - Added sort dropdown */}
            <div className="mb-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setTaskViewFilter('all')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    taskViewFilter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTaskViewFilter('pending')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    taskViewFilter === 'pending' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setTaskViewFilter('in_progress')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    taskViewFilter === 'in_progress' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setTaskViewFilter('completed')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    taskViewFilter === 'completed' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setTaskViewFilter('overdue')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    taskViewFilter === 'overdue' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Overdue
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none bg-white border rounded-lg px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="default">Default Order</option>
                    <option value="due-date-asc">Due Date (Earliest)</option>
                    <option value="due-date-desc">Due Date (Latest)</option>
                    <option value="priority-high">Priority (High to Low)</option>
                    <option value="priority-low">Priority (Low to High)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaSort className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {sortedTasks.length} tasks
                </div>
              </div>
            </div>
            
            {/* New task form with due date and priority */}
            <div className="mb-4 border rounded-lg p-3 bg-gray-50">
              <form onSubmit={addTask} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add new task..."
                    className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={!activeTaskList}
                  />
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <FaCalendar size={14} className="text-gray-500" />
                    <DatePicker
                      selected={newTaskDueDate}
                      onChange={(date) => setNewTaskDueDate(date)}
                      dateFormat="MMM d, yyyy"
                      placeholderText="Set due date"
                      className="border rounded-lg px-2 py-1 text-sm w-32"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FaFlag size={14} className={getPriorityColor(newTaskPriority)} />
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(Number(e.target.value))}
                      className="border rounded-lg px-2 py-1 text-sm"
                    >
                      <option value="1">Urgent</option>
                      <option value="2">High</option>
                      <option value="3">Medium</option>
                      <option value="4">Normal</option>
                      <option value="5">Low</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value as 'pending' | 'in_progress' | 'completed')}
                      className="border rounded-lg px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  {/* Always show the Add Task button as active when a list is selected */}
                  <button
                    type="submit"
                    className={`ml-auto px-4 py-2 rounded-lg ${
                      !activeTaskList
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                    }`}
                    disabled={!activeTaskList}
                  >
                    <FaPlus className="mr-1 inline" /> Add Task
                  </button>
                </div>
              </form>
            </div>
            
            {/* Tasks list */}
            {isLoading ? (
              <div className="flex justify-center items-center flex-grow">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto flex-grow">
                {sortedTasks.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {!activeTaskList 
                      ? 'Select a task list to get started'
                      : taskViewFilter === 'overdue' 
                        ? 'No overdue tasks - great job!'
                        : 'No tasks yet. Add your first one!'}
                  </p>
                ) : (
                  sortedTasks.map(task => (
                    <div
                      key={task.id}
                      id={`task-${task.id}`}
                      className={`flex items-start p-4 rounded-lg border ${
                        task.status === 'completed' ? 'bg-gray-50' : 
                        task.status === 'in_progress' ? 'bg-blue-50' : 'bg-white'
                      } hover:shadow-md transition-shadow`}
                    >
                      <button
                        onClick={() => toggleTask(task.id, task.status)}
                        className={`w-5 h-5 mt-1 rounded border mr-4 flex-shrink-0 flex items-center justify-center ${
                          getStatusBgColor(task.status)
                        }`}
                        title={`Status: ${task.status.replace('_', ' ')}`}
                      >
                        {getStatusIcon(task.status)}
                      </button>
                      
                      <div className="flex-grow">
                        {editingTask === task.id ? (
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={editingTaskText}
                              onChange={(e) => setEditingTaskText(e.target.value)}
                              className="flex-grow p-2 border rounded-lg"
                              autoFocus
                            />
                            <button
                              onClick={() => saveTaskEdit(task.id)}
                              className="bg-indigo-500 text-white rounded-lg px-3 hover:bg-indigo-600"
                            >
                              <FaSave />
                            </button>
                          </div>
                        ) : (
                          <p className={`mb-2 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <div className="flex items-center space-x-1">
                            <FaCalendar size={12} className={isPastDue(task.due_date as string | null) ? 'text-red-500' : ''} />
                            <DatePicker
                              selected={task.due_date ? new Date(task.due_date) : null}
                              onChange={(date) => updateTaskDueDate(task.id, date)}
                              dateFormat="MMM d, yyyy"
                              className={`bg-transparent w-24 cursor-pointer ${isPastDue(task.due_date as string | null) ? 'text-red-500' : ''}`}
                              placeholderText="Set date"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <FaFlag size={12} className={getPriorityColor(task.priority)} />
                            <select
                              value={task.priority}
                              onChange={(e) => updateTaskPriority(task.id, Number(e.target.value))}
                              className="bg-transparent cursor-pointer"
                            >
                              <option value="1">Urgent</option>
                              <option value="2">High</option>
                              <option value="3">Medium</option>
                              <option value="4">Normal</option>
                              <option value="5">Low</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <span>Status:</span>
                            <select
                              value={task.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as 'pending' | 'in_progress' | 'completed';
                                updateTaskStatus(task.id, newStatus);
                              }}
                              className="bg-transparent cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 ml-2">
                        {editingTask !== task.id && (
                          <button
                            onClick={() => startEditingTask(task)}
                            className="p-1 text-gray-400 hover:text-indigo-600"
                            title="Edit Task"
                          >
                            <FaEdit size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete Task"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListModal;