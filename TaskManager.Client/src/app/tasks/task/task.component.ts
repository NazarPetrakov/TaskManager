import { Component, inject, input, output } from '@angular/core';
import { Task } from '../../models/Task';
import {
  getPriorityClass,
  getPriorityLevelLabel,
  PriorityLevel,
} from '../../_helpers/enums/priorityLevel';
import {
  getProgressStatusLabel,
  getStatusClass,
  ProgressStatus,
} from '../../_helpers/enums/progressStatus';
import { CommonModule, DatePipe } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TaskService } from '../../_services/task.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [DatePipe, CommonModule, BsDropdownModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  private taskService = inject(TaskService);
  progressStatus = ProgressStatus;
  priorityLevel = PriorityLevel;
  task = input<Task | undefined>();
  onDelete = output<number>();
  onChangeStatus = output<[number, ProgressStatus]>();
  onChangePriority = output<[number, PriorityLevel]>();

  getPriority = getPriorityLevelLabel;
  getStatus = getProgressStatusLabel;
  getStatusClass = getStatusClass;
  getPriorityClass = getPriorityClass;

  changeStatus(status: ProgressStatus) {
    const patchDoc = [{ op: 'replace', path: '/status', value: status }];
    if (this.task()) {
      this.taskService.patchTask(this.task()!.id, patchDoc).subscribe({
        next: () => this.onChangeStatus.emit([this.task()!.id, status]),
      });
    }
  }
  changePriority(priority: PriorityLevel) {
    const patchDoc = [{ op: 'replace', path: '/priority', value: priority }];
    if (this.task()) {
      this.taskService.patchTask(this.task()!.id, patchDoc).subscribe({
        next: () => this.onChangePriority.emit([this.task()!.id, priority]),
      });
    }
  }
  deleteTask(): void {
    if (this.task()) {
      this.taskService.deleteTask(this.task()!.id).subscribe({
        next: () => this.onDelete.emit(this.task()!.id),
      });
    }
  }
}
