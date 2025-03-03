import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { AppUser } from '../models/AppUser';
import { MomentModule } from 'ngx-moment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MomentModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private usersService = inject(UsersService);
  user!: AppUser;
  today: Date = new Date();

  ngOnInit(): void {
    this.loadMe();
  }

  loadMe() {
    this.usersService.getUser().subscribe({
      next: (user) => (this.user = user),
    });
  }
  
}
