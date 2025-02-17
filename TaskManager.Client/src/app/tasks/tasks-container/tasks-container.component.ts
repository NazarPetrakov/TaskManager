import { Component, inject, input, output } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../models/Task';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'tasks-container',
  standalone: true,
  imports: [TaskComponent, InfiniteScrollModule],
  templateUrl: './tasks-container.component.html',
  styleUrl: './tasks-container.component.css',
})
export class TasksContainerComponent {
  tasks = input.required<Task[] | undefined>();
}
