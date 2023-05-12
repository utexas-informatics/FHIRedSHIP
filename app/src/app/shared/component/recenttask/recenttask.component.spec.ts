import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecenttaskComponent } from './recenttask.component';

describe('RecenttaskComponent', () => {
  let component: RecenttaskComponent;
  let fixture: ComponentFixture<RecenttaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecenttaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecenttaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
