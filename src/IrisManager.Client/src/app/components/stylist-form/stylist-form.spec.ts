import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylistForm } from './stylist-form';

describe('StylistForm', () => {
  let component: StylistForm;
  let fixture: ComponentFixture<StylistForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylistForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StylistForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
