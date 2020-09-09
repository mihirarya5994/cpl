/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyMatchesComponent } from './my-matches.component';

describe('MyMatchesComponent', () => {
  let component: MyMatchesComponent;
  let fixture: ComponentFixture<MyMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyMatchesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
