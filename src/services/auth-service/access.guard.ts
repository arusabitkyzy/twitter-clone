import {inject} from '@angular/core';
import {AuthService} from './auth-service';
import {Router} from '@angular/router';
import {map} from 'rxjs';

export const canActivateAuth= () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().
    pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }
        return router.createUrlTree(['auth/login']);
      })
  );
}
