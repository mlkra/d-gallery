import { Component, OnInit } from '@angular/core';
import { Credentials } from '../credentials';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  model = new Credentials();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signUp() {
    // TODO - add validation and stuff
    this.authService.signUpWithEmail(this.model);
  }
}
