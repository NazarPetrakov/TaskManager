import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountService } from '../../_services/account.service';
import { AppUser } from '../../models/AppUser';
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

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signUpForm = this.fb.group({
      nickName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      dateOfBirth: [new Date('2001/01/01'), Validators.required],
    });
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  onSubmit() {
    const dob = this.getDateOnly(this.signUpForm.get('dateOfBirth')?.value);
    this.signUpForm.patchValue({ dateOfBirth: dob });
    this.accountService.register(this.signUpForm.value).subscribe({
      next: (user) => {
        this.router.navigateByUrl('')
      },
      error: (error) => console.log(error),
    });
  }
  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  }
}
