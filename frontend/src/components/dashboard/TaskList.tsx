import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, FileText, CheckCircle2, Circle, Pencil, Trash, Sparkles, MessageCircle } from 'lucide-react';
import type { Task, SubStep } from '../../types';
import AgentChat from './AgentChat';

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

  // Feature 1: Replan State
  const [replanResult, setReplanResult] = useState<null | {
    summary: string;
    affected_tasks: {
      task_id: string;
      task_title: string;
      before_deadline: string;
      after_deadline: string;
      shift_reasoning: string;
    }[];
    confidence: "low" | "medium" | "high";
  }>(null);
  const [replanLoading, setReplanLoading] = useState(false);
  const [showReplanModal, setShowReplanModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // Feature 2: Escape key listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowReplanModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleCompleteTask = async (id: string) => {
    try {
      const now = new Date().toISOString();
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', completedAt: now })
      });
      if (res.ok) {
        setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', completedAt: now } : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSubstep = async (taskId: string, index: number) => {
    const task = localTasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubSteps = [...task.subSteps];
    const currentStatus = newSubSteps[index].status;
    newSubSteps[index].status = currentStatus === 'done' ? 'pending' : 'done';

    setLocalTasks(prev => prev.map(t => t.id === taskId ? { ...t, subSteps: newSubSteps } : t));

    try {
      await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subSteps: newSubSteps })
      });
    } catch (e) {
      console.error(e);
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

  const handleReplan = async (taskId: string) => {
    setReplanLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/replan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggered_by: taskId })
      });
      if (res.ok) {
        const data = await res.json();
        setReplanResult(data);
        setShowReplanModal(true);
      }
    } catch (e) {
      console.error("Replan error:", e);
    } finally {
      setReplanLoading(false);
    }
  };

  const activeTasks = localTasks.filter(t => t.status !== 'completed');
  const completedTasks = localTasks.filter(t => t.status === 'completed');
  const visibleTasks = activeTab === 'active' ? activeTasks : completedTasks;

  const criticalTaskId = activeTasks.find(t => riskMap[t.id] === 'critical')?.id;
  const showCriticalBanner = activeTab === 'active' && !!criticalTaskId;

  return (
    <>
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("active")}
          className={`text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "active" 
              ? "bg-primary/20 border border-primary/40 text-primary" 
              : "bg-white/5 border border-white/10 text-foreground/40 hover:text-foreground/60 hover:bg-white/10"
          }`}
        >
          ACTIVE OBJECTIVES ({activeTasks.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            activeTab === "completed" 
              ? "bg-primary/20 border border-primary/40 text-primary" 
              : "bg-white/5 border border-white/10 text-foreground/40 hover:text-foreground/60 hover:bg-white/10"
          }`}
        >
          COMPLETED ({completedTasks.length})
        </button>
      </div>

      <div className="space-y-6">
        {showCriticalBanner && (
          <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-md px-6 py-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-red-400 mb-1">
                ⚠ CRITICAL ALERT
              </div>
              <p className="text-sm text-muted-foreground">
                One or more tasks need immediate attention. Let the agent replan your schedule.
              </p>
            </div>
            <button 
              onClick={() => handleReplan(criticalTaskId!)}
              disabled={replanLoading}
              className="text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {replanLoading ? <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : null}
              REPLAN NOW
            </button>
          </div>
        )}

        {visibleTasks.length === 0 && (
          <div className="text-foreground/30 text-sm text-center py-12">
            {activeTab === "active" ? "No active objectives. Add one above." : "No completed tasks yet. Keep going."}
          </div>
        )}

        {visibleTasks.map(task => {
          const currentRisk = riskMap[task.id] || task.riskState || 'evaluating...';

          return (
            <div key={task.id} className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md ${task.status === 'completed' ? 'opacity-75' : ''}`}>
              {/* Task Header */}
              <div className="p-7 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center w-full mb-6">
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-500/40">
                          ✓ COMPLETED
                        </span>
                      ) : (
                        <>
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
                        </>
                      )}
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
                          {task.status !== 'completed' && (
                            <button onClick={() => handleCompleteTask(task.id)} className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm transition-colors cursor-pointer text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 flex items-center gap-1.5"><CheckCircle2 size={12}/> Complete</button>
                          )}
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
                      <h3 className={`text-2xl font-bold ${task.status === 'completed' ? 'line-through text-foreground/50' : 'text-foreground'}`}>{task.title}</h3>
                      {task.status === 'completed' && task.completedAt && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Completed · {new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
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
              </div>

              {/* Task Body: SubSteps & Artifacts */}
              <div className="p-7 bg-black/20 flex flex-col lg:flex-row gap-8">
                {/* Substeps Timeline */}
                <div className="flex-1">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-6">Execution Sequence</h4>
                  <div className="space-y-0">
                    {task.subSteps.map((step: SubStep, idx: number) => (
                      <div key={step.id} className={`flex gap-5 relative py-3.5 ${idx !== task.subSteps.length - 1 ? 'border-b border-white/5' : ''}`}>
                        {/* Timeline line */}
                        {idx !== task.subSteps.length - 1 && (
                          <div className="absolute top-10 left-2.5 bottom-[-16px] w-[2px] bg-white/10" />
                        )}
                        
                        <div 
                          className="shrink-0 mt-0.5 relative z-10 bg-black cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => handleToggleSubstep(task.id, idx)}
                        >
                          {step.status === 'done' ? (
                            <CheckCircle2 className="text-primary" size={20} />
                          ) : step.status === 'in_progress' ? (
                            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          ) : (
                            <Circle className="text-muted-foreground hover:text-primary transition-colors" size={20} />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-1">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-start gap-3">
                              <p className={`text-base font-medium ${step.status === 'done' ? 'text-foreground/50 line-through' : 'text-foreground'} leading-tight mt-0.5`}>
                                {step.title}
                              </p>
                              <span className="text-sm font-mono text-muted-foreground shrink-0 bg-white/5 px-2 py-0.5 rounded whitespace-nowrap">
                                {new Date(step.subDeadline).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <p className="text-sm text-muted-foreground">Est: {step.estimateMins}m</p>
                              
                              {!step.artifact && task.status !== 'completed' && (
                                <button 
                                  onClick={() => handleDraft(task.id, idx)} 
                                  disabled={artifactLoading[`${task.id}-${idx}`]}
                                  className="text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-sm transition-colors cursor-pointer text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 flex items-center gap-1 shrink-0"
                                >
                                  {artifactLoading[`${task.id}-${idx}`] ? (
                                    <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                  ) : <Sparkles size={12} />} Draft
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Artifacts Container */}
                <div className="flex-1 lg:max-w-sm space-y-6">
                  {task.subSteps.filter((s: SubStep) => s.artifact).map((step: SubStep) => (
                    <div key={step.id}>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5 flex items-center gap-2">
                        <FileText size={14} className="text-primary" /> {step.title} Artifact
                      </h4>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-inner">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/70 bg-white/10 px-2 py-1 rounded">
                            {step.artifact!.type.replace('_', ' ')}
                          </span>
                        </div>
                        <h5 className="text-base font-semibold text-foreground mb-2">{step.artifact!.title}</h5>
                        <div className="text-sm text-foreground/80 whitespace-pre-wrap font-mono leading-loose max-h-72 overflow-y-auto custom-scrollbar">
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

      {/* OVERLAY AND MODAL FOR CASCADE REPLANNING */}
      {showReplanModal && replanResult && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowReplanModal(false)}
        >
          <div 
            className="bg-[#0a0a0f] border border-white/10 rounded-2xl backdrop-blur-md p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <button 
              onClick={() => setShowReplanModal(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-sm">
                AGENT REPLAN
              </span>
              <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${
                replanResult.confidence === 'high' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                replanResult.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                Confidence: {replanResult.confidence}
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-foreground mb-2">Proposed Schedule Changes</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{replanResult.summary}</p>
            
            <div className="w-full h-px bg-white/10 my-6" />
            
            {/* Modal Body */}
            <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-4">SCHEDULE DIFF</p>
            
            <div className="space-y-3">
              {replanResult.affected_tasks.map((affected, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-medium text-foreground mb-2">{affected.task_title}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <span className="text-xs text-red-400 font-mono line-through opacity-80">
                      {new Date(affected.before_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-primary font-bold hidden sm:inline">→</span>
                    <span className="text-xs text-green-400 font-mono">
                      {new Date(affected.after_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/50 mt-1 italic">{affected.shift_reasoning}</p>
                </div>
              ))}
            </div>
            
            <div className="w-full h-px bg-white/10 my-6" />
            
            {/* Modal Footer */}
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowReplanModal(false)}
                className="bg-white/10 text-foreground border border-white/20 px-6 py-3 text-sm rounded-lg font-bold cursor-pointer hover:bg-white/20 transition-all active:scale-[0.97] uppercase tracking-wide backdrop-blur-sm"
              >
                DISMISS
              </button>
              <button 
                onClick={() => {
                  setShowReplanModal(false);
                  setReplanResult(null);
                  console.log("SUCCESS: Agent Replan Approved and Executed.");
                }}
                className="bg-primary text-primary-foreground px-6 py-3 text-sm rounded-lg font-bold cursor-pointer hover:brightness-110 transition-all active:scale-[0.97] uppercase tracking-wide"
              >
                APPROVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat FAB */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-primary hover:bg-primary/80 shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center"
      >
        {showCriticalBanner && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        )}
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Drawer Overlay */}
      {chatOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30" 
          onClick={() => setChatOpen(false)} 
        />
      )}
      <AgentChat 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        tasks={tasks} 
      />
    </>
  );
}
