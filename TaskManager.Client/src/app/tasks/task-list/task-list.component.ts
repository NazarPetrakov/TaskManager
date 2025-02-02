import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../_services/task.service';
import { Task } from '../../models/Task';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TasksContainerComponent } from '../tasks-container/tasks-container.component';
import { ProgressStatus } from '../../_helpers/enums/progressStatus';
import { PriorityLevel } from '../../_helpers/enums/priorityLevel';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TabsModule, TasksContainerComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  tasks = signal<Task[]>([]);

  ngOnInit(): void {
    this.loadTodoTasks();
  }

  loadTodoTasks() {
    this.taskService.getCurrentUserTasks().subscribe({
      next: (tasks) => {
        console.log('todo tasks');
        this.tasks.set(tasks);
      },
    });
  }
  loadCompleteTasks() {
    this.taskService.getCurrentUserTasks().subscribe({
      next: (tasks) => {
        console.log('complete tasks');
        this.tasks.set(tasks);
      },
    });
  }
  changeTaskStatus([taskId, newStatus]: [number, ProgressStatus]) {
    console.log(newStatus);
    this.tasks.update((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }
  changeTaskPriority([taskId, newPriority]: [number, PriorityLevel]) {
    console.log(newPriority);
    this.tasks.update((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t))
    );
  }
  deleteTask(taskId: number) {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== taskId));
  }
}
