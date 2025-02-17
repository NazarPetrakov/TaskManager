import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../_services/task.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TasksContainerComponent } from '../tasks-container/tasks-container.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
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
  taskService = inject(TaskService);
  bsModalRef?: BsModalRef;
  isToDo: boolean = false;
  isCompleted: boolean = false;
  loading = signal<boolean>(false);
  selectedToDoTab = true;

  constructor(private modalService: BsModalService) {}
  onScroll() {
    console.log('scrolled!!');
  }
  ngOnInit(): void {
    if (!this.taskService.paginatedResult()) {
      this.loadTodoTasks();
    }
  }
  loadTodoTasks() {
    this.selectedToDoTab = true;
    this.loading.set(true);

    this.taskService.taskParams.update((params) => {
      params.excludeStatus = ProgressStatus.Done;
      params.status = undefined;
      return params;
    });

    this.taskService.getCurrentUserTasks().subscribe({
      next: () => {
        const counts = this.taskService.paginatedResult()?.items?.length ?? 0;
        this.isToDo = counts > 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
  loadCompleteTasks() {
    this.selectedToDoTab = false;
    this.loading.set(true);

    this.taskService.taskParams.update((params) => {
      params.status = ProgressStatus.Done;
      params.excludeStatus = undefined;
      return params;
    });

    this.taskService.getCurrentUserTasks().subscribe({
      next: () => {
        const counts = this.taskService.paginatedResult()?.items?.length ?? 0;
        this.isCompleted = counts > 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
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
  }
}
