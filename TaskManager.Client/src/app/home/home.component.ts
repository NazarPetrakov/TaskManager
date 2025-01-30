import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { AppUser } from '../models/AppUser';
import { RouterLink } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  accountService = inject(AccountService);
}
