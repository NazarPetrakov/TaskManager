import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { AppUser } from '../models/AppUser';
import { MomentModule } from 'ngx-moment';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MomentModule,
    FormsModule,
    BsDropdownModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);
  user?: AppUser;
  today: Date = new Date();

  ngOnInit(): void {
    this.loadMe();
  }

  loadMe() {
    this.usersService.getUser().subscribe({
      next: (user) => (this.user = user),
    });
  }
  goToEditProfile() {
    if (this.user) {
      this.router.navigate(['profile/edit'], { state: { user: this.user } });
    }
  }
}
