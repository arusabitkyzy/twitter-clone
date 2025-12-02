import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Auth} from './auth/auth';
import {MainLayout} from './main-layout/main-layout';
import {AuthLayout} from './auth-layout/auth-layout';
import {SignUp} from './auth/sign-up/sign-up';
import {Login} from './auth/login/login';
import {canActivateAuth} from '../services/auth-service/access.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
    ],
    canActivate: [canActivateAuth]
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: '', component: Auth },
      { path: 'signup', component: SignUp },
      { path: 'login', component: Login }
    ]
  }
];
