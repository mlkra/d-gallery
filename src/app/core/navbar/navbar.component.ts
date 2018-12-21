import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isSignInActive: boolean;
  isSignUpActive: boolean;
  isUploadActive: boolean;
  isHomeActive: boolean;

  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.location.path() === '/user/signin') {
      this.isSignInActive = false;
      this.isSignUpActive = true;
      this.isUploadActive = false;
      this.isHomeActive = false;
    } else {
      this.isSignInActive = true;
      this.isSignUpActive = false;
      if (this.location.path() === '/upload') {
        this.isUploadActive = false;
        this.isHomeActive = false;
      } else {
        this.isUploadActive = true;
        this.isHomeActive = true;
      }
    }
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/user/signin') {
          this.isSignInActive = false;
          this.isSignUpActive = true;
          this.isHomeActive = false;
        } else {
          this.isSignInActive = true;
          this.isSignUpActive = false;
          this.isHomeActive = false;
          if (this.location.path() === '/home') {
            this.isHomeActive = true;
          }
          if (this.location.path() === '/upload') {
            this.isUploadActive = false;
          } else {
            this.isUploadActive = true;
          }
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

  refresh() {
    this.router.navigateByUrl('/home');
  }

  controlsInfo() {
    $('#app-modal2').modal('show');
  }

  hideInfo() {
    $('#app-modal2').modal('hide');
  }

  isTouch() {
    if ('ontouchstart' in document.documentElement) {
      return true;
    } else {
      return false;
    }
  }
}
