import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  loginUser: any = {
    email: '',
    password: '',
  };
  passwordVisible: boolean = false;
  onLogin() {
    this.accountService.login(this.loginUser).subscribe({
      next: (_) => this.router.navigateByUrl(''),
      error: errors => console.log(errors)
    });
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
