import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionscreenComponent } from './conditionscreen.component';

describe('ConditionscreenComponent', () => {
  let component: ConditionscreenComponent;
  let fixture: ComponentFixture<ConditionscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
