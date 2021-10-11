import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpNonMemberComponent } from './help-non-member.component';

describe('HelpNonMemberComponent', () => {
  let component: HelpNonMemberComponent;
  let fixture: ComponentFixture<HelpNonMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpNonMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpNonMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
