import { Routes } from '@angular/router';
import { Login } from './Components/auth/login/login';
import { SignUp } from './Components/auth/sign-up/sign-up';
import { Training } from './Components/training/training/training';
import { Welcome } from './Components/welcome/welcome';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'signup', component: SignUp },
  { path: 'login', component: Login },
  { path: 'training', component: Training },
  { path: '**', redirectTo: '' } // Wildcard route for 404 handling
];
