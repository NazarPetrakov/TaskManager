import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { AccountService } from './account.service';
import { environment } from '../../environments/environment.development';
import { Task } from '../models/Task';
import { of, tap } from 'rxjs';
import { PaginatedResult } from '../models/Pagination';
import { TaskParams } from '../models/TaskQueryParams';
import {
  setPaginationHeaders,
  setPaginationResponse,
} from '../_helpers/paginationHelper';
import { TaskStats } from '../models/TaskStats';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private accountService = inject(AccountService);
  taskCache = new Map();
  paginatedResult = signal<PaginatedResult<Task[]> | null>(null);
  taskParams = signal<TaskParams>(
    new TaskParams(this.accountService.currentUser())
  );

  constructor() {
    effect(
      () => {
        if (!this.accountService.currentUser()) {
          this.taskCache.clear();
          this.paginatedResult.set(null);
        }
      },
      { allowSignalWrites: true }
    );
  }

  resetParams() {
    this.taskParams.set(new TaskParams(this.accountService.currentUser()));
  }
  getCurrentUserTasks() {
    const currentUser = this.accountService.currentUser();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }

    const cacheKey = Object.keys(this.taskParams())
      .map((key) => `${key}${(this.taskParams() as any)[key]}`)
      .join('-');

    const cachedResponse = this.taskCache.get(cacheKey);
    if (cachedResponse) {
      setPaginationResponse(cachedResponse, this.paginatedResult);
      return of(cachedResponse.body);
    }

    let params = setPaginationHeaders(
      this.taskParams().pageNumber,
      this.taskParams().pageSize
    )
      .append('userId', this.taskParams().userId!)
      .append('orderBy', this.taskParams().orderBy);

    if (this.taskParams().excludeStatus) {
      params = params.append('excludeStatus', this.taskParams().excludeStatus!);
    }
    if (this.taskParams().status) {
      params = params.append('status', this.taskParams().status!);
    }

    return this.http
      .get<Task[]>(this.baseUrl + 'tasks', { observe: 'response', params })
      .pipe(
        tap((response) => {
          const currentPage = this.taskParams().pageNumber;

          if (currentPage > 1) {
            this.paginatedResult.update((prev) => ({
              items: [...(prev?.items ?? []), ...(response.body ?? [])],
              pagination: JSON.parse(response.headers.get('Pagination')!),
            }));
          } else {
            setPaginationResponse(response, this.paginatedResult);
            this.taskCache.set(cacheKey, response);
          }
        })
      );
  }
  createTask(task: any) {
    return this.http.post<Task>(this.baseUrl + 'tasks', task);
  }
  patchTask(taskId: number, patchDoc: any) {
    return this.http.patch(this.baseUrl + 'tasks/' + taskId, patchDoc).pipe(
      tap(() => {
        this.taskCache.clear();
      })
    );
  }
  deleteTask(taskId: number) {
    return this.http.delete(this.baseUrl + 'tasks/' + taskId);
  }
  getTaskStatistics() {
    return this.http.get<TaskStats>(this.baseUrl + 'tasks/stats');
  }
}
