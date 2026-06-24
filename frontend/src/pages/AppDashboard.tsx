import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskForm from '../components/dashboard/TaskForm';
import TaskList from '../components/dashboard/TaskList';
import type { Task } from '../types';

export default function AppDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/tasks');
      if (res.ok) {
        const data = await res.json();
        // sort by newest first or nearest deadline
        const sorted = data.sort((a: Task, b: Task) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        setTasks(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleCreateTask = async (data: { title: string; rawInput: string; deadline: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create task');
      }
      
      await fetchTasks();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-bg text-foreground font-sora selection:bg-primary/30">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Simple Top Nav */}
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-foreground text-lg font-bold tracking-tight uppercase hover:text-primary transition-colors">
              MOMENTUM <span className="text-primary opacity-80">/ DASHBOARD</span>
            </Link>
            <div className="flex gap-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Gemini Active
              </span>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-28">
                <TaskForm onSubmit={handleCreateTask} isLoading={isLoading} />
              </div>
            </div>

            {/* Right Column: Task List */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">Active Objectives</h2>
                <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full text-muted-foreground border border-white/10">
                  {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                </span>
              </div>
              <TaskList tasks={tasks} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
