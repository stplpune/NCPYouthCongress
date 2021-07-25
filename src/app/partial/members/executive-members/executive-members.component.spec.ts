import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveMembersComponent } from './executive-members.component';

describe('ExecutiveMembersComponent', () => {
  let component: ExecutiveMembersComponent;
  let fixture: ComponentFixture<ExecutiveMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
