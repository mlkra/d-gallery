import { TestBed } from '@angular/core/testing';

import { TriggerButtonService } from './trigger-button.service';

describe('TriggerButtonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TriggerButtonService = TestBed.get(TriggerButtonService);
    expect(service).toBeTruthy();
  });
});
