import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../_services/task.service';
import { Task } from '../../models/Task';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TasksContainerComponent } from '../tasks-container/tasks-container.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NewTaskModalComponent } from '../../modals/new-task-modal/new-task-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TabsModule, TasksContainerComponent, TooltipModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  bsModalRef?: BsModalRef;
  isToDo: boolean = false;
  isCompleted: boolean = false;
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  selectedToDoTab = true;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.loadTodoTasks();
  }
  loadTodoTasks() {
    this.selectedToDoTab = true;
    this.loading.set(true);
    this.taskService.getCurrentUserTasks({ excludeStatus: 3 }).subscribe({
      next: (tasks) => {
        this.isToDo = tasks.length > 0;
        this.tasks.set(tasks);
      },
      complete: () => this.loading.set(false),
    });
  }
  loadCompleteTasks() {
    this.selectedToDoTab = false;
    this.loading.set(true);
    this.taskService.getCurrentUserTasks({ status: 3 }).subscribe({
      next: (tasks) => {
        this.isCompleted = tasks.length > 0;
        this.tasks.set(tasks);
      },
      complete: () => this.loading.set(false),
    });
  }
  // changeTaskStatus([taskId, newStatus]: [number, ProgressStatus]) {
  //   this.tasks.update((tasks) =>
  //     tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
  //   );
  // }
  // changeTaskPriority([taskId, newPriority]: [number, PriorityLevel]) {
  //   this.tasks.update((tasks) =>
  //     tasks.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t))
  //   );
  // }
  changeTask([taskId, newTask]: [number, Task]) {
    this.tasks.update((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...newTask } : t))
    );
  }
  deleteTask(taskId: number) {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== taskId));
  }
  openNewTaskModal() {
    const initialState: ModalOptions = {
      initialState: {
        title: 'New Task',
      }
    };
    this.bsModalRef = this.modalService.show(NewTaskModalComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe((task: Task) => {
      if(this.selectedToDoTab){
        this.tasks.update((tasks) => [...tasks, task])
      }
    });
  }
}
