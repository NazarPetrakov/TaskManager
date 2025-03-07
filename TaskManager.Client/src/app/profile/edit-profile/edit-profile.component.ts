import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppUser } from '../../models/AppUser';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UsersService } from '../../_services/users.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, BsDatepickerModule, RouterLink, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent {
  private router = inject(Router);
  private usersService = inject(UsersService);
  private accountService = inject(AccountService);
  user!: AppUser;
  editForm: any;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['user'];
    this.editForm = {
      nickName: this.user.nickName || '',
      description: this.user.description || '',
      dateOfBirth: this.user.dateOfBirth || '',
    };
  }
  onSubmit() {
    const date = new Date(this.editForm.dateOfBirth)
      .toISOString()
      .split('T')[0];
    const patchDoc = [
      { op: 'replace', path: '/nickName', value: this.editForm.nickName },
      { op: 'replace', path: '/description', value: this.editForm.description },
      { op: 'replace', path: '/dateOfBirth', value: date },
    ];
    this.usersService.patchUser(patchDoc).subscribe({
      next: () => {
        this.accountService.currentUser.update((user) => {
          if (user) {
            const updatedUser = { ...user, nickName: this.editForm.nickName };
            this.accountService.setCurrentUser(updatedUser);
            return updatedUser;
          }
          return user;
        });

        this.router.navigateByUrl('/profile');
      },
      error: (error) => console.log(error),
    });
  }
}
