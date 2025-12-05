import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AppStore} from './auth.store';

export const redirectLoginIfNotAuthenticated: CanActivateFn = async (route, state) => {
  const store = inject(AppStore);
  const router = inject(Router);

  const user = store.user(); // This returns the value, not a signal

  console.log('Guard check - User:', user);

  if (!user) {
    console.log('No user, redirecting to login');
    return router.parseUrl('/auth/login');
  }

  console.log('User authenticated, allowing access');
  return true;
};
