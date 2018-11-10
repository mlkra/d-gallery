import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isSignedIn();
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.isSignedIn();
  }

  private isSignedIn() {
    if (this.authService.isSignedIn()) {
      return true;
    } else {
      // TODO move to toolbar?
      this.router.navigateByUrl('/user/signin');
      return false;
    }
  }
}
