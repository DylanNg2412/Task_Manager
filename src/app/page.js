"use client"
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit2, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dueDate);
  return taskDate < today;
};

const TaskForm = ({ task, setTask, onSubmit, isEdit }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <Input
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="Task name"
          className="w-full"
        />
        <Select
          value={task.priority}
          onValueChange={(value) => setTask({ ...task, priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={task.dueDate}
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          min={today}
          className={task.dueDate && task.dueDate < today ? 'border-red-500' : ''}
        />
      </div>
      <div className="flex justify-end gap-2">
        {isEdit && (
          <Button variant="outline" onClick={() => setTask(null)}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={task.dueDate && task.dueDate < today}
        >
          {isEdit ? 'Save Changes' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

const AddTaskDialog = ({ onSubmit }) => {
  const [newTask, setNewTask] = useState({ name: '', priority: 'medium', dueDate: '' });
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.name.trim() === '') return;
    onSubmit({ ...newTask, id: Date.now(), completed: false });
    setNewTask({ name: '', priority: 'medium', dueDate: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <TaskForm task={newTask} setTask={setNewTask} onSubmit={handleSubmit} isEdit={false} />
      </DialogContent>
    </Dialog>
  );
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const overdue = isOverdue(task.dueDate);

  return (
    <div className={`flex items-center justify-between bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md ${overdue ? 'border-red-500' : ''
      }`}>
      <div className="flex-1">
        <h3 className={`font-medium ${overdue ? 'text-red-600' : ''}`}>{task.name}</h3>
        <div className={`flex items-center gap-2 text-sm mt-1 ${overdue ? 'text-red-500' : 'text-gray-500'
          }`}>
          <Calendar className="w-4 h-4" />
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : 'No due date'}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(task)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const TaskManagementDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleEdit = (task) => {
    setEditingTask({ ...task });
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingTask.name.trim() === '') return;
    setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task));
    setEditingTask(null);
  };

  const priorityGroups = {
    high: tasks.filter(task => task.priority === 'high'),
    medium: tasks.filter(task => task.priority === 'medium'),
    low: tasks.filter(task => task.priority === 'low')
  };

  const priorityStyles = {
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Dashboard</h1>
        <AddTaskDialog onSubmit={handleAddTask} />
      </div>

      <div className="grid gap-6">
        {Object.entries(priorityGroups).map(([priority, priorityTasks]) => (
          <Card key={priority} className={`${priorityStyles[priority].bg} border ${priorityStyles[priority].border}`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className={`capitalize ${priorityStyles[priority].text}`}>
                {priority} Priority
              </CardTitle>
              <span className="text-sm font-medium">{priorityTasks.length} tasks</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priorityTasks.map(task => (
                  editingTask?.id === task.id ? (
                    <div key={task.id} className="bg-white rounded-lg shadow-sm border p-4">
                      <TaskForm
                        task={editingTask}
                        setTask={setEditingTask}
                        onSubmit={handleSaveEdit}
                        isEdit={true}
                      />
                    </div>
                  ) : (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  )
                ))}
                {priorityTasks.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No {priority} priority tasks yet
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskManagementDashboard;