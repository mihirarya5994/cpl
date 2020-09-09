import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRoomsComponent } from './join-rooms.component';

describe('JoinRoomsComponent', () => {
  let component: JoinRoomsComponent;
  let fixture: ComponentFixture<JoinRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
