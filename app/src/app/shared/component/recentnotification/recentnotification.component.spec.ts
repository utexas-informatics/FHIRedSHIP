import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentnotificationComponent } from './recentnotification.component';

describe('RecentnotificationComponent', () => {
  let component: RecentnotificationComponent;
  let fixture: ComponentFixture<RecentnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentnotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
