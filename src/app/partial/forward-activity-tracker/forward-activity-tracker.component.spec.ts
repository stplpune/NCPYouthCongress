import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardActivityTrackerComponent } from './forward-activity-tracker.component';

describe('ForwardActivityTrackerComponent', () => {
  let component: ForwardActivityTrackerComponent;
  let fixture: ComponentFixture<ForwardActivityTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardActivityTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardActivityTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
