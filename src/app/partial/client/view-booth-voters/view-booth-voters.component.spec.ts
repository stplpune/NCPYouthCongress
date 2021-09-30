import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBoothVotersComponent } from './view-booth-voters.component';

describe('ViewBoothVotersComponent', () => {
  let component: ViewBoothVotersComponent;
  let fixture: ComponentFixture<ViewBoothVotersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBoothVotersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBoothVotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
