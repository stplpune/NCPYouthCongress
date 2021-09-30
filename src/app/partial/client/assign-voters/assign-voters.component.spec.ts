import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVotersComponent } from './assign-voters.component';

describe('AssignVotersComponent', () => {
  let component: AssignVotersComponent;
  let fixture: ComponentFixture<AssignVotersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignVotersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
