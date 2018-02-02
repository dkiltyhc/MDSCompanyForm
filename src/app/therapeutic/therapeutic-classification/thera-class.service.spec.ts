import { TestBed, inject } from '@angular/core/testing';

import { TheraClassService } from './thera-class.service';

describe('TheraClassService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TheraClassService]
    });
  });

  it('should be created', inject([TheraClassService], (service: TheraClassService) => {
    expect(service).toBeTruthy();
  }));
});
