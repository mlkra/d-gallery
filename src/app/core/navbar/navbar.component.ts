import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isSignInActive: boolean;
  isSignUpActive: boolean;

  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.location.path() === '/user/signin') {
      this.isSignInActive = false;
      this.isSignUpActive = true;
    } else {
      this.isSignInActive = true;
      this.isSignUpActive = false;
    }
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/user/signin') {
          this.isSignInActive = false;
          this.isSignUpActive = true;
        } else {
          this.isSignInActive = true;
          this.isSignUpActive = false;
        }
      }
    });
  }

  isSignedIn() {
    return this.authService.isSignedIn();
  }

  signOut() {
    this.authService.signOut();
  }
}
