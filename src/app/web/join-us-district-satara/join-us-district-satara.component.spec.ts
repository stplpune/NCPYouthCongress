import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinUsDistrictSataraComponent } from './join-us-district-satara.component';

describe('JoinUsDistrictSataraComponent', () => {
  let component: JoinUsDistrictSataraComponent;
  let fixture: ComponentFixture<JoinUsDistrictSataraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinUsDistrictSataraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinUsDistrictSataraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
