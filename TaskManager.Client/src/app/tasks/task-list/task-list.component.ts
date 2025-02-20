import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TaskService } from '../../_services/task.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TasksContainerComponent } from '../tasks-container/tasks-container.component';
import { TooltipDirective, TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NewTaskModalComponent } from '../../modals/new-task-modal/new-task-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProgressStatus } from '../../_helpers/enums/progressStatus';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TabsModule,
    TasksContainerComponent,
    TooltipModule,
    InfiniteScrollModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  @ViewChild('pop', { static: false }) tooltip!: TooltipDirective;
  taskService = inject(TaskService);
  bsModalRef?: BsModalRef;
  isToDo: boolean = false;
  isCompleted: boolean = false;
  loading = signal<boolean>(false);
  selectedToDoTab = true;
  pageNumber = 1;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    if (!this.taskService.paginatedResult()) {
      this.loadTodoTasks();
    }
  }
  onScroll() {
    this.loadScrollTasks();
  }
  loadScrollTasks() {
    let hasNextPage =
      this.taskService.paginatedResult()?.pagination?.hasNextPage;
    this.pageNumber = this.taskService.taskParams().pageNumber;

    this.taskService.taskParams.update((params) => {
      params.pageNumber = this.pageNumber + 1;
      return params;
    });
    if (hasNextPage) {
      this.taskService.getCurrentUserTasks().subscribe({});
    }
  }
  loadTodoTasks() {
    this.selectedToDoTab = true;
    this.loading.set(true);
    this.taskService.resetParams();

    this.taskService.taskParams.update((params) => {
      params.excludeStatus = ProgressStatus.Done;
      return params;
    });

    this.taskService.getCurrentUserTasks().subscribe({
      next: () => {
        const counts = this.taskService.paginatedResult()?.items?.length ?? 0;
        this.isToDo = counts > 0;
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }
  loadCompleteTasks() {
    this.selectedToDoTab = false;
    this.loading.set(true);
    this.taskService.resetParams();

    this.taskService.taskParams.update((params) => {
      params.status = ProgressStatus.Done;
      return params;
    });

    this.taskService.getCurrentUserTasks().subscribe({
      next: () => {
        const counts = this.taskService.paginatedResult()?.items?.length ?? 0;
        this.isCompleted = counts > 0;
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }
  openNewTaskModal() {
    const initialState: ModalOptions = {
      initialState: {
        title: 'New Task',
      },
    };
    this.bsModalRef = this.modalService.show(
      NewTaskModalComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';

    setTimeout(() => {
      if (this.tooltip) {
        this.tooltip.isDisabled = true;
      }
    }, 0);

    this.bsModalRef.onHidden?.subscribe(() => {
      setTimeout(() => {
        if (this.tooltip) {
          this.tooltip.isDisabled = false;
        }
      }, 100);
    });
  }
}
