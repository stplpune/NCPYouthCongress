import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAgentsToBoothsComponent } from './assign-agents-to-booths.component';

describe('AssignAgentsToBoothsComponent', () => {
  let component: AssignAgentsToBoothsComponent;
  let fixture: ComponentFixture<AssignAgentsToBoothsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignAgentsToBoothsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignAgentsToBoothsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
