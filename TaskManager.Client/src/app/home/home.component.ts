import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { AppUser } from '../models/AppUser';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { TaskService } from '../_services/task.service';
import { TaskStats } from '../models/TaskStats';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../_pipes/truncate.pipe';
import { TaskStateService } from '../_services/task-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TruncatePipe, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private taskService = inject(TaskService);
  private taskStateService = inject(TaskStateService);
  private router = inject(Router);
  accountService = inject(AccountService);
  isLoading = true;
  taskStats: TaskStats = {
    toDoCount: 0,
    completeCount: 0,
    urgentTasks: [],
  };

  ngOnInit(): void {
    if (this.accountService.currentUser()) this.loadTaskStatistics();
  }
  navigateToTasks() {
    this.router.navigate(['tasks']);
  }
  loadTaskStatistics() {
    this.taskService.getTaskStatistics().subscribe({
      next: (stats) => {
        this.taskStats = stats;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
