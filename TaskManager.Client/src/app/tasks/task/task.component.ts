import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TaskService } from '../../_services/task.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { ToastrService } from 'ngx-toastr';
import { TaskStateService } from '../../_services/task-state.service';
import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    BsDatepickerModule,
    CommonModule,
    BsDropdownModule,
    FormsModule,
    MomentModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  @ViewChild('editInput') editInput!: ElementRef;
  private taskService = inject(TaskService);
  private toastr = inject(ToastrService);
  taskStateService = inject(TaskStateService);
  bsModalRef?: BsModalRef;
  progressStatus = ProgressStatus;
  priorityLevel = PriorityLevel;
  task = input<Task | undefined>();

  date?: Date;
  isEditing = false;
  updatedDescription: string = '';

  constructor(private modalService: BsModalService) {}

  getPriority = getPriorityLevelLabel;
  getStatus = getProgressStatusLabel;
  getStatusClass = getStatusClass;
  getPriorityClass = getPriorityClass;

  ngOnInit(): void {
    this.getTaskDate();
  }

  getTaskDate() {
    const taskData = this.task();
    if (taskData && taskData.deadLine) {
      this.date = new Date(taskData.deadLine);
    }
  }
  updateDate() {
    if (!this.task()) return;

    const updatedDeadline = this.date ? this.date.toISOString() : null;

    this.updateTask([
      { op: 'replace', path: '/deadLine', value: updatedDeadline },
    ]);
  }
  changeStatus(status: ProgressStatus) {
    const patchDoc: { op: 'replace'; path: string; value: any }[] = [
      { op: 'replace', path: '/status', value: status },
    ];

    if (status === ProgressStatus.Done) {
      patchDoc.push({
        op: 'replace',
        path: '/completedAt',
        value: new Date().toISOString(),
      });
    } else {
      patchDoc.push({ op: 'replace', path: '/completedAt', value: null });
    }

    this.updateTask(patchDoc);
  }
  changePriority(priority: PriorityLevel) {
    this.updateTask([{ op: 'replace', path: '/priority', value: priority }]);
  }

  deleteTask(): void {
    const options: ModalOptions = {
      initialState: {
        title: 'Confirming',
        message: 'Do you want to delete the task?',
        btnOkText: 'Yes',
        btnCancelText: 'No',
      },
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, options);
    this.bsModalRef.onHidden?.subscribe(() => {
      if (this.task() && this.bsModalRef?.content.confirmed) {
        this.taskService.deleteTask(this.task()!.id).subscribe({
          next: () => {
            this.taskService.taskCache.clear();
            this.taskService.paginatedResult.update((paginated) => {
              if (!paginated) return paginated;
              return {
                ...paginated,
                items: paginated.items?.filter((t) => t.id !== this.task()!.id),
              };
            });
          },
        });
      }
    });
  }
  saveDescription() {
    const trimmedDescription = this.updatedDescription.trim();

    if (trimmedDescription.length > 512) {
      this.toastr.error('Description cannot be longer than 512 characters.');
      return;
    }

    this.updateTask([
      { op: 'replace', path: '/description', value: trimmedDescription },
    ]);
    this.isEditing = false;
  }

  enableEdit() {
    this.isEditing = true;
    this.updatedDescription = this.task()!.description;
    setTimeout(() => {
      this.editInput?.nativeElement.focus();
    });
  }
  discardEdit() {
    this.isEditing = false;
  }

  getDeadlineClass(): { [key: string]: boolean } {
    const task = this.task();
    if (!task?.deadLine) return {};

    const now = new Date();
    const deadlineDate = new Date(task.deadLine);

    const timeDiff = deadlineDate?.getTime() - now.getTime();
    const hoursLeft = timeDiff / (1000 * 60 * 60);

    return {
      'fa-clock text-success': hoursLeft >= 24,
      'fa-hourglass-half text-warning': hoursLeft > 0 && hoursLeft < 24,
      'fa-triangle-exclamation text-danger': timeDiff < 0,
    };
  }
  getCompletedMoment() {
    const task = this.task();
    if (!task || !task.completedAt || !task.createdAt) {
      return;
    }
    const completedAt = new Date(task.completedAt);
    const createdAt = new Date(task.createdAt);

    const diffInMilliseconds = completedAt.getTime() - createdAt.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const remainingHours = Math.floor(diffInHours % 24);

    return `${diffInDays} days, ${remainingHours} hours`;
  }

  private updateTask(patchDoc: { op: 'replace'; path: string; value: any }[]) {
    const task = this.task();
    if (!task) return;

    const updatedTask = patchDoc.reduce(
      (updated, patch) => {
        return { ...updated, [patch.path.replace('/', '')]: patch.value };
      },
      { ...task }
    );

    this.taskService.patchTask(task.id, patchDoc).subscribe({
      next: () => {
        this.taskService.clearTaskStatsCache();
        this.taskService.paginatedResult.update((paginated) => {
          if (!paginated) return paginated;
          return {
            ...paginated,
            items: paginated.items?.map((t) =>
              t.id === task.id ? { ...t, ...updatedTask } : t
            ),
          };
        });
      },
    });
  }
}
