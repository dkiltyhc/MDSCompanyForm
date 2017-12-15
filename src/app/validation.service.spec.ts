import { TestBed, inject } from '@angular/core/testing';

import { Validation.ServiceService } from './validation.service.service';

describe('Validation.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Validation.ServiceService]
    });
  });

  it('should be created', inject([Validation.ServiceService], (service: Validation.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
