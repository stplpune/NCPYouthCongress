import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBoothComponent } from './assign-booth.component';

describe('AssignBoothComponent', () => {
  let component: AssignBoothComponent;
  let fixture: ComponentFixture<AssignBoothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignBoothComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
