import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    const locationSpy = jasmine.createSpyObj('Location', ['path']);
    locationSpy.path.and.returnValue('user/signin');

    const routerSpy = jasmine.createSpyObj('Router', ['events']);
    routerSpy.events = [
      new NavigationEnd(1, '/user/signin', '/user/signin')
    ];

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isSignedIn', 'signOut']);
    authServiceSpy.isSignedIn.and.returnValue(false);

    TestBed.configureTestingModule({
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ],
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isSignInActive should be false', () => {
    expect(component.isSignInActive).toBeFalsy();
  });

  it('isSignUpActive should be true', () => {
    expect(component.isSignUpActive).toBeTruthy();
  });

  it('isUploadActive should be true', () => {
    expect(component.isUploadActive).toBeTruthy();
  });

  it('isSignedIn should return false', () => {
    const ret = component.isSignedIn();
    expect(ret).toBeFalsy();
  });

  it('signOut should be defined', () => {
    component.signOut();
    expect(component.signOut).toBeDefined();
  });
});
