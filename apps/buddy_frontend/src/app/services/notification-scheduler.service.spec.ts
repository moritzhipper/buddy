import { TestBed } from '@angular/core/testing';

import { NotificationSchedulerService } from './notification-scheduler.service';

describe('NotificationSchedulerService', () => {
  let service: NotificationSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
