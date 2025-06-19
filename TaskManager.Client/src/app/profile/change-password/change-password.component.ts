import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../_services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private usersService = inject(UsersService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  changePasswordData = {
    currentPassword: '',
    newPassword: '',
  };

  currentPasswordVisible: boolean = false;
  newPasswordVisible: boolean = false;

  validationErrors: any[] | undefined;

  onSubmit(form: any) {
    if (form.invalid) return;

    this.usersService.changePassword(this.changePasswordData).subscribe({
      next: () => {
        this.router.navigateByUrl('/profile');
        this.toastr.success('Password successfully changed');
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
