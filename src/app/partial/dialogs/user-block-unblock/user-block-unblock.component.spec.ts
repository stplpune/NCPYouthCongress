import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBlockUnblockComponent } from './user-block-unblock.component';

describe('UserBlockUnblockComponent', () => {
  let component: UserBlockUnblockComponent;
  let fixture: ComponentFixture<UserBlockUnblockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBlockUnblockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBlockUnblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
