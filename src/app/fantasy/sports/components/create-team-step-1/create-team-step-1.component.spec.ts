/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateTeamStep1Component } from './create-team-step-1.component';

describe('CreateTeamStep1Component', () => {
  let component: CreateTeamStep1Component;
  let fixture: ComponentFixture<CreateTeamStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTeamStep1Component]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeamStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
