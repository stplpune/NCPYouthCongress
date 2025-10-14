import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManKhatavMembersListComponent } from './man-khatav-members-list.component';

describe('ManKhatavMembersListComponent', () => {
  let component: ManKhatavMembersListComponent;
  let fixture: ComponentFixture<ManKhatavMembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManKhatavMembersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManKhatavMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
