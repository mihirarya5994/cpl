/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SportsBarComponent } from './sports-bar.component';

describe('SportsBarComponent', () => {
  let component: SportsBarComponent;
  let fixture: ComponentFixture<SportsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportsBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
