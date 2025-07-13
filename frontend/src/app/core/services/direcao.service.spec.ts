import { TestBed } from '@angular/core/testing';

import { DirecaoService } from './direcao.service';

describe('DirecaoService', () => {
  let service: DirecaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirecaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
