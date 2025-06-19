import { Task } from "./Task";

export interface TaskStats {
 toDoCount: number,
 completeCount: number,
 urgentTasks: Task[]
}