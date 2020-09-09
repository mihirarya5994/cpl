/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JcpaTileComponent } from './jcpa-tile.component';

describe('JcpaTileComponent', () => {
  let component: JcpaTileComponent;
  let fixture: ComponentFixture<JcpaTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JcpaTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JcpaTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
