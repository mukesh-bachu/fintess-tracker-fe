import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItopbarComponent } from './itopbar.component';

describe('ItopbarComponent', () => {
  let component: ItopbarComponent;
  let fixture: ComponentFixture<ItopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItopbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
