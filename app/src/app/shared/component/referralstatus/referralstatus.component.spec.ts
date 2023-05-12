import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralstatusComponent } from './referralstatus.component';

describe('ReferralstatusComponent', () => {
  let component: ReferralstatusComponent;
  let fixture: ComponentFixture<ReferralstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
