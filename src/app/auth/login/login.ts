import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service/auth-service';
import {AppStore} from '../../../services/auth-service/auth.store';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // 1 = enter email, 2 = enter password
  step = signal(1);

  private router = inject(Router);
  private authService = inject(AuthService);
  private appStore = inject(AppStore);

  formEmailGroup = new FormGroup({
    email: new FormControl('', Validators.required)
  });

  formPasswordGroup = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  // ---- Step 1 → Step 2 ----
  onNext() {
    const emailCtrl = this.formEmailGroup.controls.email;
    console.log(emailCtrl.value);
    if (emailCtrl.invalid) {
      emailCtrl.markAsTouched();
      return;
    }

    this.step.set(2);
  }
  // ---- Step 2 → Login ----
  onSubmit() {
    const passwordCtrl = this.formPasswordGroup.controls.password;

    if (passwordCtrl.invalid) {
      passwordCtrl.markAsTouched();
      return;
    }

    const email = this.formEmailGroup.controls.email.value!;
    const password = passwordCtrl.value!;

    console.log(email)
    console.log(password)

    this.appStore.login(email, password);
  }

  // Optional Back button
  backToEmail() {
    this.step.set(1);
  }
}
