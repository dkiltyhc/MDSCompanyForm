import { TestBed, inject } from '@angular/core/testing';

import { TheraListService } from './thera-list.service';

describe('TheraListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TheraListService]
    });
  });

  it('should be created', inject([TheraListService], (service: TheraListService) => {
    expect(service).toBeTruthy();
  }));
});
