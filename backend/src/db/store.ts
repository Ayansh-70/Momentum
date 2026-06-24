import fs from 'fs';
import path from 'path';
import { Task } from '../types';

const DATA_FILE = path.join(__dirname, '../../data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf-8');
}

export const getTasks = (): Task[] => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

export const getTaskById = (id: string): Task | undefined => {
  const tasks = getTasks();
  return tasks.find(t => t.id === id);
};

export const createTask = (task: Task): Task => {
  const tasks = getTasks();
  tasks.push(task);
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  return task;
};

export const updateTask = (task: Task): Task => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    tasks[index] = task;
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  }
  return task;
};
