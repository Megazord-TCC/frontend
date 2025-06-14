import { TestBed } from '@angular/core/testing';

import { CriteriaGroupComparationsService } from './criteria-group-comparations.service';

describe('CriteriaGroupComparationsService', () => {
  let service: CriteriaGroupComparationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriaGroupComparationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
