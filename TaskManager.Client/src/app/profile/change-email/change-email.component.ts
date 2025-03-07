import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../_services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.css',
})
export class ChangeEmailComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);
  newEmail: string = '';
  validationErrors: any[] | undefined;

  onSubmit(form: any) {
    if (form.invalid) return;

    this.usersService.changeEmail(this.newEmail).subscribe({
      next: () => {
        this.router.navigateByUrl('/profile');
      },
      error: (errors) => {
        console.error(errors);
        this.validationErrors = Array.isArray(errors) ? errors : undefined;
      },
    });
  }
}
