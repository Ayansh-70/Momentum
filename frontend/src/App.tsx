import React, { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import type { Task } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Momentum</h1>
          <p className="text-gray-600">The AI productivity agent that helps you finish tasks.</p>
        </header>

        <main>
          <TaskForm onTaskCreated={fetchTasks} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Tasks</h2>
          <TaskList tasks={tasks} />
        </main>
      </div>
    </div>
  );
}

export default App;
