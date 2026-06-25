import React, { useState } from 'react';
import { Sparkles, Calendar, Type } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: { title: string; rawInput: string; deadline: string }) => Promise<void>;
  isLoading: boolean;
}

export default function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [rawInput, setRawInput] = useState('');
  // Default to tomorrow 5pm
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(17, 0, 0, 0);
  // format to YYYY-MM-DDTHH:mm
  const defaultDeadline = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  
  const [deadline, setDeadline] = useState(defaultDeadline);

  const getMinDateTime = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const minDateTime = getMinDateTime();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;

    if (new Date(deadline).getTime() <= Date.now()) {
      alert("Cannot schedule a task for a time that has already passed.");
      return;
    }

    await onSubmit({ title, rawInput, deadline });
    setTitle('');
    setRawInput('');
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(252,100,68,0.3)]">
          <Sparkles className="text-primary" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">New Objective</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Initialize AI Decomposition</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
            <Type size={12} className="text-primary" /> Title
          </label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Prepare Q3 Board Deck"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={12} className="text-primary" /> Deadline
          </label>
          <input
            required
            type="datetime-local"
            value={deadline}
            min={minDateTime}
            onFocus={(e) => { e.target.min = getMinDateTime(); }}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all [color-scheme:dark]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Raw Input (Context)</label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste emails, docs, or random thoughts here. Gemini will organize it."
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !title || !deadline}
          className="w-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest py-3.5 rounded-xl hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(252,100,68,0.2)] hover:shadow-[0_0_30px_rgba(252,100,68,0.4)]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Decomposing...
            </span>
          ) : (
            "Initiate Sequence"
          )}
        </button>
      </form>
    </div>
  );
}
