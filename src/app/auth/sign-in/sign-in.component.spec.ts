import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SignInComponent } from './sign-in.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  const authServiceSpy = jasmine.createSpyObj('AuthService', ['']);
  const routerSpy = jasmine.createSpyObj('Router', ['']);
  const ngZoneSpy = jasmine.createSpyObj('NgZone', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ SignInComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgZone, useValue: ngZoneSpy }
      ]
    })
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(SignInComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
