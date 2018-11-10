import { Component, OnInit, NgZone } from '@angular/core';
import { Credentials } from '../credentials';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  model = new Credentials();

  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) { }

  ngOnInit() {
  }

  signInWithEmail() {
    this.authService.signInWithEmail(this.model).then((res) => {
      console.log(res);
      this.redirectHome();
    });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then((res) => {
      console.log(res);
      this.redirectHome();
    });
  }

  signInWithFacebook() {
    this.authService.signInWithFacebook().then((res) => {
      console.log(res);
      this.redirectHome();
    });
  }

  signInWithGithub() {
    this.authService.signInWithGithub().then((res) => {
      console.log(res);
      this.redirectHome();
    });
  }

  // TODO implement and use (in catch)
  private checkAuthResult() {

  }

  private redirectHome() {
    this.ngZone.run(() => {
      this.router.navigateByUrl('/home');
    });
  }
}
