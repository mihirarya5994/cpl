import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstreamVideoAdComponent } from './instream-video-ad.component';

describe('InstreamVideoAdComponent', () => {
  let component: InstreamVideoAdComponent;
  let fixture: ComponentFixture<InstreamVideoAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstreamVideoAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstreamVideoAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
