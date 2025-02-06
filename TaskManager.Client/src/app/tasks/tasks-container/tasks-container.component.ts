import { Component, inject, input, output } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../models/Task';
import { ProgressStatus } from '../../_helpers/enums/progressStatus';
import { PriorityLevel } from '../../_helpers/enums/priorityLevel';

@Component({
  selector: 'tasks-container',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './tasks-container.component.html',
  styleUrl: './tasks-container.component.css',
})
export class TasksContainerComponent {
  onDelete = output<number>();
  ChangeTask = output<[number, Task]>();
  tasks = input.required<Task[]>();

  onDeleteTask(taskId: number) {
    this.onDelete.emit(taskId);
  }
  onChangeTask([taskId, newTask]: [number, Task]) {
    this.ChangeTask.emit([taskId, newTask]);
  }
  // onChangeTaskPriority([taskId, newPriority]: [number, PriorityLevel]) {
  //   this.onChangePriority.emit([taskId, newPriority]);
  // }
}
