/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateTeamStep2Component } from './create-team-step-2.component';

describe('CreateTeamStep2Component', () => {
  let component: CreateTeamStep2Component;
  let fixture: ComponentFixture<CreateTeamStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTeamStep2Component]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeamStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
