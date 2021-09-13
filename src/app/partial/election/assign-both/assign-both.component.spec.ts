import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBothComponent } from './assign-both.component';

describe('AssignBothComponent', () => {
  let component: AssignBothComponent;
  let fixture: ComponentFixture<AssignBothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignBothComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
