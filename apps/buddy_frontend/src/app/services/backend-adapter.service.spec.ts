import { TestBed } from '@angular/core/testing';

import { BackendAdapterService } from './backend-adapter.service';

describe('BackendAdapterService', () => {
   let service: BackendAdapterService;

   beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(BackendAdapterService);
   });

   it('should be created', () => {
      expect(service).toBeTruthy();
   });
});
