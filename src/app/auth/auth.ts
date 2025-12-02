import {Component, inject} from '@angular/core';
import {Button} from '../../components/ui/button/button';
import {SignUp} from './sign-up/sign-up';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [
    Button,
    SignUp,
    RouterOutlet
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  standalone: true
})
export class Auth {
  private router = inject(Router);

  clickSignUp() {
    console.log('clickSignUp');
    return this.router.navigate(['/auth/signup']);
  }

  clickLogin() {
    console.log('clickLogin');
    return this.router.navigate(['/auth/login']);
  }

  closeModal() {
    return this.router.navigate(['/auth']); // Navigate back to auth page
  }
}
