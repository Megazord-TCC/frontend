import { TestBed } from '@angular/core/testing';

import { AllocationRequestService } from './allocation-request.service';

describe('AllocationRequestService', () => {
  let service: AllocationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllocationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
