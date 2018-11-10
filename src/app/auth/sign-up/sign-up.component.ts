import { Component, OnInit, NgZone } from '@angular/core';
import { Credentials } from '../credentials';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  model = new Credentials();

  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) { }

  ngOnInit() {
  }

  signUp() {
    // TODO - add validation (catch) and stuff
    this.authService.signUpWithEmail(this.model).then((res) => {
      console.log(res);
      this.redirectHome();
    });
  }

  // TODO implement and use
  private checkAuthResult() {

  }

  private redirectHome() {
    this.ngZone.run(() => {
      this.router.navigateByUrl('/home');
    });
  }
}
