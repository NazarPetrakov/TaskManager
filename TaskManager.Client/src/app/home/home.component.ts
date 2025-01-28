import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { User } from '../models/User';
import { RouterLink } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  private usersService = inject(UsersService)
  accountService = inject(AccountService)
  users: User[] = []
  ngOnInit(): void {
  }
  loadUsers(){
    this.usersService.getUsers().subscribe({
      next: usersq => this.users = usersq
    })
  }
}
