import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskStateService {
  selectedToDoTab = signal<boolean>(true);
}
