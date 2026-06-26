"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getAllTasks = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_FILE = path_1.default.join(__dirname, '../../data.json');
// Initialize data file if it doesn't exist
if (!fs_1.default.existsSync(DATA_FILE)) {
    fs_1.default.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf-8');
}
const getTasks = () => {
    const data = fs_1.default.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
};
exports.getTasks = getTasks;
const getTaskById = (id) => {
    const tasks = (0, exports.getTasks)();
    return tasks.find(t => t.id === id);
};
exports.getTaskById = getTaskById;
const createTask = (task) => {
    const tasks = (0, exports.getTasks)();
    tasks.push(task);
    fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
    return task;
};
exports.createTask = createTask;
const getAllTasks = () => {
    return (0, exports.getTasks)();
};
exports.getAllTasks = getAllTasks;
const updateTask = (id, patch) => {
    const tasks = (0, exports.getTasks)();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...patch };
        fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
        return tasks[index];
    }
    return undefined;
};
exports.updateTask = updateTask;
const deleteTask = (id) => {
    const tasks = (0, exports.getTasks)();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
        return true;
    }
    return false;
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=store.js.map