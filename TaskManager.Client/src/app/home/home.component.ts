import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { User } from '../models/User';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  ngOnInit(): void {
    this.loadUser();
  }
  private usersService = inject(UsersService)
  users: User[] = []

  loadUser(){
    this.usersService.getUsers().subscribe({
      next: users => this.users = users
    })
  }
}
