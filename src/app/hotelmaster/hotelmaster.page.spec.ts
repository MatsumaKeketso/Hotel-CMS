import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelmasterPage } from './hotelmaster.page';

describe('HotelmasterPage', () => {
  let component: HotelmasterPage;
  let fixture: ComponentFixture<HotelmasterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelmasterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelmasterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
