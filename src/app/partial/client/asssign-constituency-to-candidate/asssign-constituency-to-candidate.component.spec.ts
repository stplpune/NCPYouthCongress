import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsssignConstituencyToCandidateComponent } from './asssign-constituency-to-candidate.component';

describe('AsssignConstituencyToCandidateComponent', () => {
  let component: AsssignConstituencyToCandidateComponent;
  let fixture: ComponentFixture<AsssignConstituencyToCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsssignConstituencyToCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsssignConstituencyToCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
