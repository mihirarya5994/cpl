/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FullPageAdsComponent } from './full-page-ads.component';

describe('FullPageAdsComponent', () => {
  let component: FullPageAdsComponent;
  let fixture: ComponentFixture<FullPageAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullPageAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullPageAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
