import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRewardPopupComponent } from './daily-reward-popup.component';

describe('DailyRewardPopupComponent', () => {
  let component: DailyRewardPopupComponent;
  let fixture: ComponentFixture<DailyRewardPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyRewardPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRewardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
