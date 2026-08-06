import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StylistListComponent } from './stylist-list';

describe('StylistListComponent', () => {
  let component: StylistListComponent;
  let fixture: ComponentFixture<StylistListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylistListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StylistListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});