import { TestBed } from '@angular/core/testing';

import { Auth.GaurdService } from './auth.gaurd.service';

describe('Auth.GaurdService', () => {
  let service: Auth.GaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth.GaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
