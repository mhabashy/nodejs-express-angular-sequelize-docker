import { TestBed } from '@angular/core/testing';

import { DiocesesService } from './dioceses.service';

describe('DiocesesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiocesesService = TestBed.get(DiocesesService);
    expect(service).toBeTruthy();
  });
});
