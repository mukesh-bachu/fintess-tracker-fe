import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglefitLoginComponent } from './googlefit-login.component';

describe('GooglefitLoginComponent', () => {
  let component: GooglefitLoginComponent;
  let fixture: ComponentFixture<GooglefitLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GooglefitLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GooglefitLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
