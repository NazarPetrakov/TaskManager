import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient)
  baseUrl = environment.baseUrl;

  getUsers(){
    return this.http.get<User[]>(this.baseUrl + 'users');
  }
}
