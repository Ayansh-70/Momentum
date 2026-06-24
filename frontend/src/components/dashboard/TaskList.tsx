import React from 'react';
import { Clock, AlertTriangle, FileText, CheckCircle2, Circle } from 'lucide-react';
import type { Task, SubStep } from '../../types';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
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
      {tasks.map(task => (
        <div key={task.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Task Header */}
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${
                  task.riskState === 'calm' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  task.riskState === 'watch' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-destructive/20 text-destructive border border-destructive/30'
                }`}>
                  Status: {task.riskState}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-sm">
                  {task.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground">{task.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> Due {new Date(task.deadline).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Est: {task.effortEstimateMins}m
                </span>
              </div>
            </div>
            {task.riskReason && (
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg max-w-xs">
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
                        <p className={`text-sm font-medium ${step.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {step.title}
                        </p>
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

            {/* Artifacts (if any exist for the first substep, or on the task) */}
            {task.subSteps[0]?.artifact && (
              <div className="flex-1 lg:max-w-sm">
                <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 flex items-center gap-2">
                  <FileText size={14} className="text-primary" /> Initial Artifact
                </h4>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/70 bg-white/10 px-2 py-1 rounded">
                      {task.subSteps[0].artifact.type.replace('_', ' ')}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-foreground mb-2">{task.subSteps[0].artifact.title}</h5>
                  <div className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                    {task.subSteps[0].artifact.content}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
