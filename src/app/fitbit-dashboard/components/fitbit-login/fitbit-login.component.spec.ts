import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitbitLoginComponent } from './fitbit-login.component';

describe('FitbitLoginComponent', () => {
  let component: FitbitLoginComponent;
  let fixture: ComponentFixture<FitbitLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FitbitLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitbitLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
