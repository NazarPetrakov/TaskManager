import {
  Component,
  ElementRef,
  HostListener,
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
import {
  BsDatepickerDirective,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

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
  minDate: Date;
  bsModalRef?: BsModalRef;
  progressStatus = ProgressStatus;
  priorityLevel = PriorityLevel;
  task = input<Task | undefined>();
  onDelete = output<number>();

  onChangeTask = output<[number, Task]>();

  date?: Date;
  isEditing = false;
  updatedDescription: string = '';

  constructor(private modalService: BsModalService) {
    this.minDate = new Date();
  }
  getPriority = getPriorityLevelLabel;
  getStatus = getProgressStatusLabel;
  getStatusClass = getStatusClass;
  getPriorityClass = getPriorityClass;

  ngOnInit(): void {
    this.getTaskData();
  }

  getTaskData() {
    const taskData = this.task();
    if (taskData && taskData.deadLine) {
      this.date = new Date(taskData.deadLine);
    }
  }
  updateDate() {
    let patchDoc: any;

    if (this.date) {
      const patchDate = this.date.toISOString();
      patchDoc = [{ op: 'replace', path: '/deadline', value: patchDate }];
    } else {
      patchDoc = [{ op: 'replace', path: '/deadline' }];
    }

    if (this.task()) {
      this.taskService.patchTask(this.task()!.id, patchDoc).subscribe();
    }
  }
  changeStatus(status: ProgressStatus) {
    const task = this.task();
    if (!task) return;

    const patchDoc: { op: 'replace'; path: string; value: any }[] = [
      { op: 'replace', path: '/status', value: status },
    ];

    let updatedTask: Task = { ...task, status };

    if (status === ProgressStatus.Done) {
      const completedAt = new Date();
      patchDoc.push({
        op: 'replace',
        path: '/completedAt',
        value: completedAt.toISOString(),
      });
      updatedTask = { ...updatedTask, completedAt };
    } else if (task.status === ProgressStatus.Done) {
      patchDoc.push({ op: 'replace', path: '/completedAt', value: null });
      updatedTask = { ...updatedTask, completedAt: undefined };
    }

    this.taskService.patchTask(task.id, patchDoc).subscribe({
      next: () => this.onChangeTask.emit([task.id, updatedTask]),
    });
  }
  changePriority(priority: PriorityLevel) {
    const task = this.task();
    if (!task) return;

    let updatedTask: Task = { ...task, priority };

    const patchDoc = [{ op: 'replace', path: '/priority', value: priority }];
    this.taskService.patchTask(task.id, patchDoc).subscribe({
      next: () => this.onChangeTask.emit([task.id, updatedTask]),
    });
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
          next: () => this.onDelete.emit(this.task()!.id),
        });
      }
    });
  }
  saveDescription() {
    const task = this.task();
    if (!task) return;

    const updatedTask = { ...task, description: this.updatedDescription.trim() };

    const patchDoc = [
        { op: 'replace', path: '/description', value: updatedTask.description },
    ];

    if(task.description !== updatedTask.description){
      this.taskService.patchTask(task.id, patchDoc).subscribe({
        next: () => this.onChangeTask.emit([task.id, updatedTask]),
    });
    }

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
}
