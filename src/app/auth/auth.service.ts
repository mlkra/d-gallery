import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, auth } from 'firebase/app';
import { Credentials } from './credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<User>;
  private userDetails: User;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.authState;

    this.user.subscribe((user) => {
      if (user) {
        this.userDetails = user;
        localStorage.setItem('auth', 'true');
        // TOREMOVE for debug
        console.log(this.userDetails);
      } else {
        this.userDetails = null;
        localStorage.setItem('auth', 'false');
      }
    });
  }

  signInWithEmail(creds: Credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(
      creds.email, creds.password
    );
  }

  signUpWithEmail(creds: Credentials) {
    // TODO - add validation and stuff
    return this.afAuth.auth.createUserWithEmailAndPassword(
      creds.email,
      creds.password
    );
  }

  signInWithGoogle() {
    return this.afAuth.auth.signInWithPopup(
      new auth.GoogleAuthProvider()
    );
  }

  signInWithFacebook() {
    return this.afAuth.auth.signInWithPopup(
      new auth.FacebookAuthProvider()
    );
  }

  signInWithGithub() {
    return this.afAuth.auth.signInWithPopup(
      new auth.GithubAuthProvider()
    );
  }

  isSignedIn() {
    if (localStorage.getItem('auth') === 'true') {
      return true;
    } else {
      return false;
    }
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigateByUrl('/');
    });
  }
}
