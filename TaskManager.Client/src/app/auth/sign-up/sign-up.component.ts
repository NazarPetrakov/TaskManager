import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [BsDatepickerModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  accountService = inject(AccountService);
  signUpForm: FormGroup = new FormGroup({});
  isFormSubmitted = false;
  passwordVisible: boolean = false;
  validationErrors: any[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signUpForm = this.fb.group({
      nickName: ['', [Validators.required, Validators.maxLength(32)]],
      description: ['', [Validators.maxLength(64)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      dateOfBirth: ['2000-01-01', Validators.required],
    });
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  onSubmit() {
    const dob = this.getDateOnly(this.signUpForm.get('dateOfBirth')?.value);
    this.signUpForm.patchValue({ dateOfBirth: dob });
    this.accountService.register(this.signUpForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('');
      },
      error: (errors) => {
        console.error(errors);
        this.validationErrors = Array.isArray(errors) ? errors : undefined;
      },
    });
  }
  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
