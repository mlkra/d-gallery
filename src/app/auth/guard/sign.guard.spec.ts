import { TestBed, async, inject } from '@angular/core/testing';

import { SignGuard } from './sign.guard';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

describe('SignGuard', () => {
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['isSignedIn']);

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        SignGuard
      ]
    });
  });

  it('should be created', inject([SignGuard], (guard: SignGuard) => {
    expect(guard).toBeTruthy();
  }));
});
