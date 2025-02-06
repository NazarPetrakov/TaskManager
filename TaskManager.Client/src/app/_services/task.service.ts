import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { environment } from '../../environments/environment.development';
import { Task } from '../models/Task';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private accountService = inject(AccountService);

  getCurrentUserTasks(additionalParams?: { [key: string]: string | number }) {
    const currentUser = this.accountService.currentUser();

    if (!currentUser || !currentUser.id) {
      return of([]);
    }

    let params = new HttpParams().set('userId', currentUser.id);

    if (additionalParams) {
      Object.keys(additionalParams).forEach((key) => {
        params = params.set(key, additionalParams[key].toString());
      });
    }
    const options = { params };

    return this.http.get<Task[]>(this.baseUrl + 'tasks', options);
  }
  createTask(task: any){
    return this.http.post<Task>(this.baseUrl + 'tasks', task)
  }
  patchTask(taskId: number, patchDoc: any) {
    return this.http.patch(this.baseUrl + 'tasks/' + taskId, patchDoc)
  }
  deleteTask(taskId: number) {
    return this.http.delete(this.baseUrl + 'tasks/' + taskId);
  }
}
