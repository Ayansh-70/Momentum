import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, FileText, CheckCircle2, Circle, Pencil, Trash, Sparkles } from 'lucide-react';
import type { Task, SubStep } from '../../types';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  useEffect(() => { setLocalTasks(tasks); }, [tasks]);

  const [riskMap, setRiskMap] = useState<Record<string, string>>({});
  const [riskLoading, setRiskLoading] = useState<Record<string, boolean>>({});

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{title: string, deadline: string}>({title: '', deadline: ''});
  const [editSaving, setEditSaving] = useState(false);

  const [artifactLoading, setArtifactLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localTasks.forEach(task => {
      if (riskMap[task.id] || riskLoading[task.id]) return;
      setRiskLoading(prev => ({ ...prev, [task.id]: true }));
      fetch(`http://localhost:3000/api/tasks/${task.id}/risk`, { method: 'POST' })
        .then(res => res.json())
        .then(data => setRiskMap(prev => ({ ...prev, [task.id]: data.risk_state })))
        .catch(console.error)
        .finally(() => setRiskLoading(prev => ({ ...prev, [task.id]: false })));
    });
  }, [localTasks]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLocalTasks(prev => prev.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSaveEdit = async (id: string) => {
    setEditSaving(true);
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setLocalTasks(prev => prev.map(t => t.id === id ? updated : t));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditSaving(false);
      setEditingId(null);
    }
  };

  const handleDraft = async (taskId: string, index: number) => {
    const key = `${taskId}-${index}`;
    setArtifactLoading(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${taskId}/artifact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ substep_index: index, artifact_type: "auto" })
      });
      if (res.ok) {
        const artifactData = await res.json();
        setLocalTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            const newSubSteps = [...t.subSteps];
            newSubSteps[index].artifact = {
              id: 'new',
              type: artifactData.artifact_type,
              title: artifactData.substep_label,
              content: artifactData.artifact_markdown,
              generatedAt: new Date().toISOString(),
              approvedByUser: false
            };
            return { ...t, subSteps: newSubSteps };
          }
          return t;
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setArtifactLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  if (localTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <CheckCircle2 className="text-muted-foreground" size={32} />
        </div>
        <h3 className="text-lg font-bold text-foreground">Zero Active Targets</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
          The queue is clear. Awaiting new objectives to decompose and execute.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {localTasks.map(task => {
        const currentRisk = riskMap[task.id] || task.riskState || 'evaluating...';

        return (
          <div key={task.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Task Header */}
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center w-full mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm flex items-center gap-1.5 ${
                      currentRisk === 'calm' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      currentRisk === 'watch' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      currentRisk === 'at_risk' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      currentRisk === 'critical' ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                      'bg-white/10 text-muted-foreground border border-white/20'
                    }`}>
                      {riskLoading[task.id] && <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />}
                      Status: {currentRisk}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-sm">
                      {task.category}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    {deleteConfirm === task.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground mr-1">Are you sure?</span>
                        <button onClick={() => handleDelete(task.id)} className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm transition-colors cursor-pointer text-destructive bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 flex items-center gap-1.5">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm transition-colors cursor-pointer text-muted-foreground bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(task.id); setEditForm({ title: task.title, deadline: task.deadline }); }} className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm transition-colors cursor-pointer text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 flex items-center gap-1.5"><Pencil size={12}/> Edit</button>
                        <button onClick={() => setDeleteConfirm(task.id)} className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm transition-colors cursor-pointer text-muted-foreground bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5"><Trash size={12}/></button>
                      </>
                    )}
                  </div>
                </div>

                {editingId === task.id ? (
                  <div className="space-y-3 mt-2 max-w-xl">
                    <input 
                      value={editForm.title} 
                      onChange={e => setEditForm(prev => ({...prev, title: e.target.value}))} 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all" 
                    />
                    <input 
                      type="datetime-local" 
                      value={editForm.deadline} 
                      onChange={e => setEditForm(prev => ({...prev, deadline: e.target.value}))} 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all [color-scheme:dark]" 
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveEdit(task.id)} disabled={editSaving} className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm transition-colors cursor-pointer text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20">
                        {editSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditingId(null)} disabled={editSaving} className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm transition-colors cursor-pointer text-muted-foreground bg-white/5 hover:bg-white/10 border border-white/10">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-foreground">{task.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> Due {new Date(task.deadline).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle size={14} /> Est: {task.effortEstimateMins}m
                      </span>
                    </div>
                  </>
                )}
              </div>
              {task.riskReason && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg max-w-xs shrink-0">
                  <p className="text-xs text-destructive-foreground font-medium flex gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    {task.riskReason}
                  </p>
                </div>
              )}
            </div>

            {/* Task Body: SubSteps & Artifacts */}
            <div className="p-6 bg-black/20 flex flex-col lg:flex-row gap-8">
              {/* Substeps Timeline */}
              <div className="flex-1">
                <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">Execution Sequence</h4>
                <div className="space-y-4">
                  {task.subSteps.map((step: SubStep, idx: number) => (
                    <div key={step.id} className="flex gap-4 relative">
                      {/* Timeline line */}
                      {idx !== task.subSteps.length - 1 && (
                        <div className="absolute top-6 left-2.5 bottom-[-16px] w-[2px] bg-white/10" />
                      )}
                      
                      <div className="shrink-0 mt-0.5 relative z-10 bg-black">
                        {step.status === 'done' ? (
                          <CheckCircle2 className="text-primary" size={20} />
                        ) : step.status === 'in_progress' ? (
                          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        ) : (
                          <Circle className="text-muted-foreground" size={20} />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${step.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {step.title}
                            </p>
                            {!step.artifact && (
                              <button 
                                onClick={() => handleDraft(task.id, idx)} 
                                disabled={artifactLoading[`${task.id}-${idx}`]}
                                className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm transition-colors cursor-pointer text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 flex items-center gap-1 shrink-0"
                              >
                                {artifactLoading[`${task.id}-${idx}`] ? (
                                  <div className="w-2 h-2 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                ) : <Sparkles size={10} />} Draft
                              </button>
                            )}
                          </div>
                          <span className="text-xs font-mono text-muted-foreground shrink-0 bg-white/5 px-2 py-0.5 rounded">
                            {new Date(step.subDeadline).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Est: {step.estimateMins}m</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artifacts Container */}
              <div className="flex-1 lg:max-w-sm space-y-6">
                {task.subSteps.filter((s: SubStep) => s.artifact).map((step: SubStep) => (
                  <div key={step.id}>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 flex items-center gap-2">
                      <FileText size={14} className="text-primary" /> {step.title} Artifact
                    </h4>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/70 bg-white/10 px-2 py-1 rounded">
                          {step.artifact!.type.replace('_', ' ')}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-foreground mb-2">{step.artifact!.title}</h5>
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                        {step.artifact!.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
