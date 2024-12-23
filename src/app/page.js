"use client"
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaskManagementDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', priority: 'medium', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.name.trim() === '') return;

    const task = {
      id: Date.now(),
      ...newTask,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask({ name: '', priority: 'medium', dueDate: '' });
  };

  const handleEdit = (task) => {
    setEditingTask({ ...task });
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSaveEdit = () => {
    if (editingTask.name.trim() === '') return;

    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const priorityGroups = {
    high: tasks.filter(task => task.priority === 'high'),
    medium: tasks.filter(task => task.priority === 'medium'),
    low: tasks.filter(task => task.priority === 'low')
  };

  const priorityColors = {
    high: 'bg-red-100',
    medium: 'bg-yellow-100',
    low: 'bg-green-100'
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                placeholder="Task name"
                className="flex-1 p-2 border rounded"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="p-2 border rounded"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <PlusCircle className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {Object.entries(priorityGroups).map(([priority, priorityTasks]) => (
        <Card key={priority} className={priorityColors[priority]}>
          <CardHeader>
            <CardTitle className="capitalize">{priority} Priority Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priorityTasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                  {editingTask?.id === task.id ? (
                    <div className="flex-1 flex items-center gap-4">
                      <input
                        type="text"
                        value={editingTask.name}
                        onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                        className="flex-1 p-2 border rounded"
                      />
                      <select
                        value={editingTask.priority}
                        onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                        className="p-2 border rounded"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      <input
                        type="date"
                        value={editingTask.dueDate}
                        onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                        className="p-2 border rounded"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 text-green-600 hover:text-green-800"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-600 hover:text-gray-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{task.name}</div>
                        <div className="text-sm text-gray-600">
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {priorityTasks.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  No {priority} priority tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskManagementDashboard;