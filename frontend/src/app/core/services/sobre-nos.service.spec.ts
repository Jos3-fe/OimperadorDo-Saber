import { TestBed } from '@angular/core/testing';

import { SobreNosService } from './sobre-nos.service';

describe('SobreNosService', () => {
  let service: SobreNosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SobreNosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
