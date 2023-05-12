import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatassesmentsComponent } from './patassesments.component';

describe('PatassesmentsComponent', () => {
  let component: PatassesmentsComponent;
  let fixture: ComponentFixture<PatassesmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatassesmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatassesmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
