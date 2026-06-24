import React from 'react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return <div className="text-gray-500">No tasks created yet.</div>;
  }

  return (
    <div className="space-y-6">
      {tasks.map(task => (
        <div key={task.id} className="bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-bold mb-2">{task.title}</h3>
          <div className="text-sm text-gray-600 mb-4">
            <span className="mr-4">Deadline: {new Date(task.deadline).toLocaleString()}</span>
            <span className="mr-4">Category: {task.category}</span>
            <span>Est. Effort: {task.effortEstimateMins} mins</span>
          </div>
          
          <h4 className="font-semibold mb-2">Sub Steps:</h4>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            {task.subSteps.map(step => (
              <li key={step.id}>
                <span className="font-medium">{step.title}</span> 
                <span className="text-sm text-gray-500 ml-2">
                  (due {new Date(step.subDeadline).toLocaleString()}, {step.estimateMins}m)
                </span>
                
                {step.artifact && (
                  <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-xs text-blue-500 uppercase font-bold mb-1">
                      Starter Artifact: {step.artifact.type}
                    </div>
                    <div className="font-semibold mb-1">{step.artifact.title}</div>
                    <pre className="whitespace-pre-wrap text-sm font-sans">{step.artifact.content}</pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
