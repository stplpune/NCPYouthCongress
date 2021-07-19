import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaMessagesComponent } from './social-media-messages.component';

describe('SocialMediaMessagesComponent', () => {
  let component: SocialMediaMessagesComponent;
  let fixture: ComponentFixture<SocialMediaMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
