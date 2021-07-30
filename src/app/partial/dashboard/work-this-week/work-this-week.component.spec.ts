import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkThisWeekComponent } from './work-this-week.component';

describe('WorkThisWeekComponent', () => {
  let component: WorkThisWeekComponent;
  let fixture: ComponentFixture<WorkThisWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkThisWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkThisWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
