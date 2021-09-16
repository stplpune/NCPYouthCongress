import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionProfileComponent } from './election-profile.component';

describe('ElectionProfileComponent', () => {
  let component: ElectionProfileComponent;
  let fixture: ComponentFixture<ElectionProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectionProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
