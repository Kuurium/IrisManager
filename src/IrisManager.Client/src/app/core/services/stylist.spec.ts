import { TestBed } from '@angular/core/testing';

import { Stylist } from './stylist';

describe('Stylist', () => {
  let service: Stylist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Stylist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
