import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { SignGuard } from './auth/guard/sign.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: 'src/app/rendering/rendering.module#RenderingModule',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: 'src/app/auth/auth.module#AuthModule',
    canActivate: [SignGuard],
    canLoad: [SignGuard]
  },
  {
    path: 'upload',
    loadChildren: 'src/app/upload/upload.module#UploadModule',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
