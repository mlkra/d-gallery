import { TestBed } from '@angular/core/testing';

import { JoystickService } from './joystick.service';

describe('JoystickService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JoystickService = TestBed.get(JoystickService);
    expect(service).toBeTruthy();
  });
});
