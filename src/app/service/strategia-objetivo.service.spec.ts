import { TestBed } from '@angular/core/testing';

import { StrategiaObjetivoService } from './strategia-objetivo.service';

describe('StrategiaObjetivoService', () => {
  let service: StrategiaObjetivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategiaObjetivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
