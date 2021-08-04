import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyProgramDetailsComponent } from './party-program-details.component';

describe('PartyProgramDetailsComponent', () => {
  let component: PartyProgramDetailsComponent;
  let fixture: ComponentFixture<PartyProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyProgramDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
