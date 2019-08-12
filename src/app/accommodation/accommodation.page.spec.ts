import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationPage } from './accommodation.page';

describe('AccommodationPage', () => {
  let component: AccommodationPage;
  let fixture: ComponentFixture<AccommodationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccommodationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccommodationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
