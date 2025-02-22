import { Task } from '../Models/Task';

export interface Goal {
    id: number;
    title?: string;
    description?: string;
    tasks?: Task[];
    userId?: string;
};