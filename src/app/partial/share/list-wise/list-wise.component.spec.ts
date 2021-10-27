import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWiseComponent } from './list-wise.component';

describe('ListWiseComponent', () => {
  let component: ListWiseComponent;
  let fixture: ComponentFixture<ListWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
