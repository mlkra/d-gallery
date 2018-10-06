import { Component, OnInit } from '@angular/core';
import { Credentials } from '../credentials';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  model = new Credentials();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signInWithEmail() {
    this.authService.signInWithEmail(this.model).then((res) => {
      console.log(res);
    });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then((res) => {
      console.log(res);
    });
  }

  signInWithFacebook() {
    this.authService.signInWithFacebook().then((res) => {
      console.log(res);
    });
  }

  signInWithGithub() {
    this.authService.signInWithGithub().then((res) => {
      console.log(res);
    });
  }
}
