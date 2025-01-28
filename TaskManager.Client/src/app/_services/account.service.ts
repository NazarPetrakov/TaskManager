import { inject, Injectable, signal } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  currentUser = signal<AppUser | null>(null);

  login(model:any){
    return this.http.post<AppUser>(this.baseUrl + 'account/login', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }

  register(model:any){
    return this.http.post<AppUser>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }
  setCurrentUser(user: AppUser){
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUser.set(user);
  }
  logout(){
    localStorage.removeItem("user")
    this.currentUser.set(null);
  }
}
