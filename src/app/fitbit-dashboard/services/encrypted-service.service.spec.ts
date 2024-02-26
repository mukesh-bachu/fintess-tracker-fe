import { TestBed } from '@angular/core/testing';

import { EncryptedServiceService } from './encrypted-service.service';

describe('EncryptedServiceService', () => {
  let service: EncryptedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
