import { TestBed } from '@angular/core/testing';

import { MetricServicesService } from './metric-services.service';

describe('MetricServicesService', () => {
  let service: MetricServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
