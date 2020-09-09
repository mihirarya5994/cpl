import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailsTabComponent } from './room-details-tab.component';

describe('RoomDetailsTabComponent', () => {
  let component: RoomDetailsTabComponent;
  let fixture: ComponentFixture<RoomDetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomDetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
