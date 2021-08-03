import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyProgramMasterComponent } from './party-program-master.component';

describe('PartyProgramMasterComponent', () => {
  let component: PartyProgramMasterComponent;
  let fixture: ComponentFixture<PartyProgramMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyProgramMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyProgramMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
