import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
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

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [BsDatepickerModule, CommonModule, BsDropdownModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  @ViewChild('editInput') editInput!: ElementRef;
  private taskService = inject(TaskService);
  private toastr = inject(ToastrService);
  bsModalRef?: BsModalRef;
  progressStatus = ProgressStatus;
  priorityLevel = PriorityLevel;
  task = input<Task | undefined>();

  date?: Date;
  isEditing = false;
  updatedDescription: string = '';

  constructor(private modalService: BsModalService) {
  }
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
    if (!this.date) {
      this.updateTask([{ op: 'replace', path: '/deadline', value: null }]);
    } else {
      this.updateTask([
        { op: 'replace', path: '/deadline', value: this.date.toISOString() },
      ]);
    }
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
