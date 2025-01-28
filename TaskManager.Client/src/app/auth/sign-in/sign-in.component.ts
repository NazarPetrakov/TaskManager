import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  loginUser: any = {
    email: 'Email@gmail.com',
    password: 'Password1234',
  };
  passwordVisible: boolean = false;
  onLogin() {
    this.accountService.login(this.loginUser).subscribe({
      next: (_) => this.router.navigateByUrl(''),
    });
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
