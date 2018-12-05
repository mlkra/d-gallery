import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'firebase/app';

describe('AuthService', () => {
  beforeEach(() => {
    const afAuthSpy = jasmine.createSpyObj('AngularFireAuth', ['auth', 'authState']);
    afAuthSpy.authState = new Observable((observer) => {
      observer.next({});
    });
    afAuthSpy.auth = {
      signInWithEmail: function() {
        return {};
      },
      signOut: function() {
        return new Promise(() => {
          2 + 2;
        });
      }
    };
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: afAuthSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('isSignedIn should return true', () => {
    const service: AuthService = TestBed.get(AuthService);
    const ret = service.isSignedIn();
    expect(ret).toBeTruthy();
  });
});
