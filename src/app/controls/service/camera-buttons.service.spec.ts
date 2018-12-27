import { TestBed } from '@angular/core/testing';

import { CameraButtonsService } from './camera-buttons.service';

describe('CameraButtonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CameraButtonsService = TestBed.get(CameraButtonsService);
    expect(service).toBeTruthy();
  });
});
