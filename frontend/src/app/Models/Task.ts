export interface Task {
    id: number;
    title?: string;
    isCompleted: boolean;
    dueDate: string | null;
    goalId: number;
    priority?: string;
};