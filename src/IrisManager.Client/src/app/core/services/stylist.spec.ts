import { TestBed } from '@angular/core/testing';
import { StylistService } from './stylist.service';

describe('StylistService', () => {
  let service: StylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});