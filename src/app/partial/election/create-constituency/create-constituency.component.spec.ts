import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConstituencyComponent } from './create-constituency.component';

describe('CreateConstituencyComponent', () => {
  let component: CreateConstituencyComponent;
  let fixture: ComponentFixture<CreateConstituencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConstituencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConstituencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
