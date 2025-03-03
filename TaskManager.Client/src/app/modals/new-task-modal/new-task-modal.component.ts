import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TaskService } from '../../_services/task.service';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './new-task-modal.component.html',
  styleUrl: './new-task-modal.component.css',
})
export class NewTaskModalComponent implements OnInit, AfterViewInit  {
  @ViewChild('descriptionInput') descriptionInput!: ElementRef<HTMLInputElement>;
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  minDate = new Date();
  newTaskForm?: FormGroup;
  isFormSubmitted = false;
  validationErrors: any[] | undefined;
  title?: string;
  closeBtnName?: string;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  ngAfterViewInit() {
    setTimeout(() => this.descriptionInput.nativeElement.focus(), 0);
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
      let task = { ...this.newTaskForm?.value, deadline: date };

      this.taskService.createTask(task).subscribe({
        next: (newTask) => {
          this.taskService.taskCache.clear();
          this.taskService.paginatedResult.update((paginated) => {
            if (!paginated)
              return {
                items: [newTask],
                pagination: {
                  currentPage: 1,
                  itemsPerPage: 15,
                  totalItems: 1,
                  totalPages: 1,
                  hasPreviousPage: false,
                  hasNextPage: false,
                },
              };
            return {
              ...paginated,
              items: [newTask, ...(paginated.items ?? [])],
              pagination: {
                ...paginated.pagination!,
                totalItems: (paginated.pagination?.totalItems ?? 0) + 1,
              },
            };
          });

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
    if (!date) return;
    return date.toISOString();
  }
}
