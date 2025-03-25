import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { BehaviorSubject, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private userCache$ = new BehaviorSubject<AppUser | null>(null);
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;

  getUser() {
    if (this.userCache$.value) {
      return of(this.userCache$.value);
    }

    return this.http
      .get<AppUser>(this.baseUrl + 'users/me')
      .pipe(tap((user) => this.userCache$.next(user)));
  }
  patchUser(patchDoc: any) {
    return this.http.patch(this.baseUrl + 'users/me', patchDoc);
  }
  changeEmail(newEmail: string) {
    return this.http.post(this.baseUrl + 'users/me/change-email', { newEmail });
  }
  changePassword(changePassword: any) {
    return this.http.post(
      this.baseUrl + 'users/me/change-password',
      changePassword
    );
  }
  refreshUser() {
    return this.http
      .get<AppUser>(this.baseUrl + 'users/me')
      .pipe(tap((user) => this.userCache$.next(user)));
  }
  clearCache(): void {
    this.userCache$.next(null);
  }
}
