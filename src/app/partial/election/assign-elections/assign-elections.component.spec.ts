import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignElectionsComponent } from './assign-elections.component';

describe('AssignElectionsComponent', () => {
  let component: AssignElectionsComponent;
  let fixture: ComponentFixture<AssignElectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignElectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignElectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
