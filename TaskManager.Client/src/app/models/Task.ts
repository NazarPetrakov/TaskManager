import { PriorityLevel } from "../_helpers/enums/priorityLevel";
import { ProgressStatus } from "../_helpers/enums/progressStatus";

export interface Task {
  id: number;
  title?: string;
  description: string;
  status: ProgressStatus;
  priority: PriorityLevel;
  deadLine?: Date;
  createdAt?: Date;
  completedAt?: Date;
}

