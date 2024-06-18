import { TestBed } from '@angular/core/testing';

import { LoadingIdicatorService } from './loading-idicator.service';

describe('LoadingIdicatorService', () => {
  let service: LoadingIdicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingIdicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
