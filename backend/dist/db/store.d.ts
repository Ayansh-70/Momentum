import { Task } from '../types';
export declare const getTasks: () => Task[];
export declare const getTaskById: (id: string) => Task | undefined;
export declare const createTask: (task: Task) => Task;
export declare const getAllTasks: () => Task[];
export declare const updateTask: (id: string, patch: Partial<Task>) => Task | undefined;
export declare const deleteTask: (id: string) => boolean;
//# sourceMappingURL=store.d.ts.map