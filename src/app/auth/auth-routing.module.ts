import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignGuard } from './guard/sign.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin'
  },
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [SignGuard],
    canLoad: [SignGuard]
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [SignGuard],
    canLoad: [SignGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
