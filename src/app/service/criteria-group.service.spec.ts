import { TestBed } from '@angular/core/testing';

import { CriteriaGroupService } from './criteria-group.service';

describe('CriteriaGroupService', () => {
  let service: CriteriaGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriaGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
