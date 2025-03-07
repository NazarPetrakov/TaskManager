import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../_services/users.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);

  changePasswordData = {
    currentPassword: '',
    newPassword: '',
  };

  // Separate booleans for each password field
  currentPasswordVisible: boolean = false;
  newPasswordVisible: boolean = false;

  validationErrors: any[] | undefined;

  onSubmit(form: any) {
    if (form.invalid) return;

    this.usersService.changePassword(this.changePasswordData).subscribe({
      next: () => {
        this.router.navigateByUrl('/profile');
      },
      error: (errors) => {
        console.error(errors);
        this.validationErrors = Array.isArray(errors) ? errors : undefined;
      },
    });
  }

  toggleCurrentPasswordVisibility(): void {
    this.currentPasswordVisible = !this.currentPasswordVisible;
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }
}
