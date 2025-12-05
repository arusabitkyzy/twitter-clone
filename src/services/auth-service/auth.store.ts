import {UserProfile} from '../../models/User';
import {signalStore, withMethods, withState} from '@ngrx/signals';
import {computed, inject} from '@angular/core';
import {AuthService} from './auth-service';
import {Router} from '@angular/router';
import {user} from '@angular/fire/auth';

export const AppStore = signalStore(
  {providedIn: 'root'},
  withState(() => {
    const authService = inject(AuthService);
    return {
      user: computed(() => authService.user()),
    }
  }),
  withMethods(() => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return {
      // ✅ Just coordinate navigation - AuthService handles Firebase
      async login(email: string, password: string) {
        try {
          await authService.login(email, password);
          await router.navigate(['/']);
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
      async logout() {
        try {
          await authService.logout();
          await router.navigate(['/auth/login']);
        } catch (error) {
          console.error('Logout failed:', error);
          throw error;
        }
      }
    }
  })
);
