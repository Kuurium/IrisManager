import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylistList } from './stylist-list';

describe('StylistList', () => {
  let component: StylistList;
  let fixture: ComponentFixture<StylistList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylistList],
    }).compileComponents();

    fixture = TestBed.createComponent(StylistList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
