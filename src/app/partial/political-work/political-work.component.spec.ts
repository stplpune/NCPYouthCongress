import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticalWorkComponent } from './political-work.component';

describe('PoliticalWorkComponent', () => {
  let component: PoliticalWorkComponent;
  let fixture: ComponentFixture<PoliticalWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoliticalWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticalWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
