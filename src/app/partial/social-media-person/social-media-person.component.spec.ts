import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaPersonComponent } from './social-media-person.component';

describe('SocialMediaPersonComponent', () => {
  let component: SocialMediaPersonComponent;
  let fixture: ComponentFixture<SocialMediaPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaPersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
