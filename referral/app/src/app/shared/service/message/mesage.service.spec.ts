import { TestBed } from '@angular/core/testing';

import { MesageService } from './mesage.service';

describe('MesageService', () => {
  let service: MesageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
