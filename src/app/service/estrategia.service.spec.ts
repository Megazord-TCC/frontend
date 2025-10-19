import { TestBed } from '@angular/core/testing';

import { EstrategiaService } from './estrategia.service';

describe('EstrategiaService', () => {
  let service: EstrategiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstrategiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
