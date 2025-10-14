import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinUsMembersListComponent } from './join-us-members-list.component';

describe('JoinUsMembersListComponent', () => {
  let component: JoinUsMembersListComponent;
  let fixture: ComponentFixture<JoinUsMembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinUsMembersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinUsMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
