import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatassesmentComponent } from './patassesment.component';

describe('PatassesmentComponent', () => {
  let component: PatassesmentComponent;
  let fixture: ComponentFixture<PatassesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatassesmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatassesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
