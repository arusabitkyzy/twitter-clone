import {Component, effect, inject, signal} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../../services/auth-service/auth-service';
import { CommonModule } from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private router = inject(Router);
  private authService = inject(AuthService);
  months = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ]
  days = Array.from({ length: 31 }, (_, i) => i + 1);
  years = Array.from(
    { length: 2025 - 1905 + 1 },
    (_, i) => 1905 + i
  );
  isButtonEnabled = signal(true);

  error: string = '';

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    month: new FormControl(null, [Validators.required]),
    day: new FormControl(null, [Validators.required]),
    year: new FormControl(null, [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  constructor() {
    effect(() => {
      const value = this.formValue(); // now reactive
      this.isButtonEnabled.set(this.form.valid);
    });
  }

  onSubmit() {
    console.log('click')
    if (this.form.valid) {
      const name = this.form.value.name as string;

      const year = Number(this.form.value.year);
      const month = Number(this.form.value.month);
      const day = Number(this.form.value.day);

      const birthday = new Date(year, month, day);
      const email = this.form.value.email as string;
      const password = this.form.value.password as string;
      const confirmPassword = this.form.value.confirmPassword as string;

      console.log(name, year, month, day, email, password, confirmPassword);

      if (password !== confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      // Register with all user data
      this.authService.register(email, password, name, birthday).subscribe({
        next: () => {
          console.log('Registration successful - user created in Auth and Firestore');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.error = this.getErrorMessage(error.code);
        },
      });
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      default:
        return 'Registration failed. Please try again.';
    }
  }
}
