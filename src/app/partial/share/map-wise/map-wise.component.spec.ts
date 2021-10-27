import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWiseComponent } from './map-wise.component';

describe('MapWiseComponent', () => {
  let component: MapWiseComponent;
  let fixture: ComponentFixture<MapWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
