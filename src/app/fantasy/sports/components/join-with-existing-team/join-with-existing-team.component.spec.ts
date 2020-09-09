import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinWithExistingTeamComponent } from './join-with-existing-team.component';

describe('JoinWithExistingTeamComponent', () => {
  let component: JoinWithExistingTeamComponent;
  let fixture: ComponentFixture<JoinWithExistingTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinWithExistingTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinWithExistingTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
