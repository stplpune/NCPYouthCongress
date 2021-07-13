import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaImageComponent } from './social-media-image.component';

describe('SocialMediaImageComponent', () => {
  let component: SocialMediaImageComponent;
  let fixture: ComponentFixture<SocialMediaImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
