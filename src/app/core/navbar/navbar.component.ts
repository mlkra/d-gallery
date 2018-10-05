import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isSignInActive: boolean;
  isSignUpActive: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.isSignInActive = true;
    this.isSignUpActive = false;
    // TODO get info from router and adjust variables,
    //      bind to router event
  }

  isSignedIn() {
    // TODO use AuthService to get info
    return true;
  }
}
