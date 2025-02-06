import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TaskService } from '../../_services/task.service';
import { Task } from '../../models/Task';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './new-task-modal.component.html',
  styleUrl: './new-task-modal.component.css',
})
export class NewTaskModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  minDate = new Date();
  newTaskForm?: FormGroup;
  isFormSubmitted = false;
  validationErrors: any[] | undefined;
  title?: string;
  closeBtnName?: string;

  onClose: Subject<Task> = new Subject();

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.newTaskForm = this.fb.group({
      title: [, Validators.maxLength(32)],
      description: ['', [Validators.required, Validators.maxLength(512)]],
      priority: [0, [Validators.min(0), Validators.max(3)]],
      deadline: [],
    });
  }
  createTask() {
    this.isFormSubmitted = true;
    if (!this.newTaskForm?.invalid) {
      const date = this.formatDate(this.newTaskForm?.get('deadline')?.value);
      let task = this.newTaskForm?.value;
      task.deadline = date;
      this.taskService.createTask(task).subscribe({
        next: (task) => {
          this.onClose.next(task);
          this.bsModalRef.hide();
        },
        error: (errors) => {
          console.error(errors);
          this.validationErrors = Array.isArray(errors) ? errors : undefined;
        },
      });
    }
  }
  formatDate(date?: Date) {
    if(!date) return;
    return date.toISOString();
  }
}
