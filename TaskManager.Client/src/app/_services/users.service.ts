import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AppUser } from '../models/AppUser';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl;

  getUser() {
    return this.http.get<AppUser>(this.baseUrl + 'users/me');
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
}
