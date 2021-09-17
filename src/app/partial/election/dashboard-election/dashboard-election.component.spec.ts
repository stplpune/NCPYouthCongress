import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardElectionComponent } from './dashboard-election.component';

describe('DashboardElectionComponent', () => {
  let component: DashboardElectionComponent;
  let fixture: ComponentFixture<DashboardElectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardElectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardElectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
