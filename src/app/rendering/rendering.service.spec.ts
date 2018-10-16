import { TestBed } from '@angular/core/testing';

import { RenderingService } from './rendering.service';

describe('RenderingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RenderingService = TestBed.get(RenderingService);
    expect(service).toBeTruthy();
  });
});
